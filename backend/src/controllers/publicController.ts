import { z } from 'zod';
import { AdSlot } from '../models/AdSlot.js';
import { Category } from '../models/Category.js';
import { Game } from '../models/Game.js';
import { Review } from '../models/Review.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sanitizeText } from '../utils/sanitize.js';

const reviewSchema = z.object({
  body: z.object({
    authorName: z.string().min(2).max(40),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(6).max(300)
  }),
  params: z.object({
    slug: z.string().min(1)
  })
});

export const getHomeData = asyncHandler(async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;

  const categories = await Category.find({ visible: true }).sort({ displayOrder: 1, name: 1 });
  const categoryFilter = category ? { categoryLabels: category } : {};
  const searchFilter = search ? { name: { $regex: search, $options: 'i' } } : {};
  const games = await Game.find({ published: true, ...categoryFilter, ...searchFilter })
    .sort({ featured: -1, createdAt: -1 })
    .limit(24);
  const ads = await AdSlot.find({ active: true, pageScope: { $in: ['*', '/'] } });
  const settings = await SiteSetting.findOne();

  res.json(apiResponse('Home data loaded', { categories, games, ads, settings }));
});

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
  res.json(apiResponse('Categories loaded', categories));
});

export const getPopularGames = asyncHandler(async (_req, res) => {
  const games = await Game.find({ published: true }).sort({ playCount: -1 }).limit(12);
  res.json(apiResponse('Popular games loaded', games));
});

export const getNewReleases = asyncHandler(async (_req, res) => {
  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const games = await Game.find({ published: true, releaseDate: { $gte: cutoff } }).sort({ releaseDate: -1 });
  res.json(apiResponse('New releases loaded', games));
});

export const getRatingsLeaderboard = asyncHandler(async (_req, res) => {
  const [games, reviews] = await Promise.all([
    Game.find({ published: true }).sort({ ratingAverage: -1, ratingCount: -1 }).limit(10),
    Review.find({ approved: true, spam: false }).sort({ createdAt: -1 }).limit(12).populate('gameId', 'name slug')
  ]);
  res.json(apiResponse('Ratings and reviews loaded', { topRatedGames: games, latestReviews: reviews }));
});

export const getGameBySlug = asyncHandler(async (req, res) => {
  const game = await Game.findOne({ slug: req.params.slug, published: true });
  if (!game) {
    throw new ApiError(404, 'Game not found');
  }

  const [reviews, relatedGames, ads] = await Promise.all([
    Review.find({ gameId: game._id, approved: true, spam: false }).sort({ pinned: -1, createdAt: -1 }).limit(20),
    Game.find({ _id: { $ne: game._id }, published: true, categoryLabels: { $in: game.categoryLabels } }).limit(6),
    AdSlot.find({ active: true, pageScope: { $in: ['*', '/game/:slug'] } })
  ]);

  res.json(apiResponse('Game details loaded', { game, reviews, relatedGames, ads }));
});

export const submitReview = asyncHandler(async (req, res) => {
  const { body, params } = reviewSchema.parse({ body: req.body, params: req.params });
  const game = await Game.findOne({ slug: params.slug, published: true });
  if (!game) {
    throw new ApiError(404, 'Game not found');
  }

  const cleanedComment = sanitizeText(body.comment);
  const spamIndicators = ['http://', 'https://', 'free money', 'casino'];
  const spam = spamIndicators.some((phrase) => cleanedComment.toLowerCase().includes(phrase));

  const review = await Review.create({
    gameId: game._id,
    authorName: sanitizeText(body.authorName),
    rating: body.rating,
    comment: cleanedComment,
    spam,
    approved: !spam
  });

  const reviewStats = await Review.aggregate([
    { $match: { gameId: game._id, approved: true, spam: false } },
    { $group: { _id: '$gameId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  game.ratingAverage = Number((reviewStats[0]?.avg ?? game.ratingAverage).toFixed(1));
  game.ratingCount = reviewStats[0]?.count ?? game.ratingCount;
  await game.save();

  res.status(201).json(apiResponse(spam ? 'Review submitted for moderation' : 'Review submitted', review));
});

export const submitContactMessage = asyncHandler(async (req, res) => {
  const schema = z.object({
    body: z.object({
      name: z.string().min(2).max(60),
      email: z.string().email(),
      message: z.string().min(10).max(800)
    })
  });
  const payload = schema.parse({ body: req.body }).body;

  res.json(apiResponse('Contact request received', {
    ...payload,
    name: sanitizeText(payload.name),
    message: sanitizeText(payload.message)
  }));
});

export const trackGamePlay = asyncHandler(async (req, res) => {
  const schema = z.object({
    params: z.object({ slug: z.string() }),
    body: z.object({ duration: z.number().min(0).max(300).default(0) })
  });
  const { params, body } = schema.parse({ params: req.params, body: req.body });

  const game = await Game.findOne({ slug: params.slug });
  if (!game) {
    throw new ApiError(404, 'Game not found');
  }
  game.playCount += 1;
  game.avgPlayTime = Number((((game.avgPlayTime * Math.max(game.playCount - 1, 0)) + body.duration) / game.playCount).toFixed(1));
  await game.save();

  res.json(apiResponse('Game play tracked', { playCount: game.playCount, avgPlayTime: game.avgPlayTime }));
});

export const getSiteSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSetting.findOne();
  res.json(apiResponse('Site settings loaded', settings));
});
