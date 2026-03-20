import { z } from 'zod';
import { Admin } from '../models/Admin.js';
import { AdSlot } from '../models/AdSlot.js';
import { Category } from '../models/Category.js';
import { Game } from '../models/Game.js';
import { Review } from '../models/Review.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { getDashboardMetrics } from '../services/analyticsService.js';
import { importGithubGame } from '../services/githubImportService.js';
import { apiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeText } from '../utils/sanitize.js';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

const gameBodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  coverImage: z.string().url(),
  description: z.string().min(10),
  categories: z.array(objectIdSchema).min(1),
  categoryLabels: z.array(z.string()).min(1),
  embedUrl: z.string().url(),
  localEmbedPath: z.string().optional().default(''),
  launchMode: z.enum(['PAGE', 'MODAL']).default('PAGE'),
  developerName: z.string().min(2),
  githubRepo: z.string().url().optional().or(z.literal('')),
  licenseName: z.string().min(2),
  licenseUrl: z.string().url(),
  releaseDate: z.string().optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false)
});

const categoryBodySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().min(1),
  displayOrder: z.number().int().min(0),
  parentId: objectIdSchema.nullable().optional(),
  visible: z.boolean().default(true)
});

const reviewBodySchema = z.object({
  approved: z.boolean(),
  pinned: z.boolean(),
  spam: z.boolean(),
  comment: z.string().min(3).max(300)
});

const adBodySchema = z.object({
  name: z.string().min(2),
  placement: z.enum(['HEADER_BANNER', 'SIDEBAR_VERTICAL', 'PRE_ROLL', 'IN_GAME_TOP', 'IN_GAME_BOTTOM', 'GRID_INLINE_4', 'GRID_INLINE_8']),
  type: z.enum(['IMAGE', 'VIDEO', 'HTML']).default('IMAGE'),
  mediaUrl: z.string().url(),
  redirectUrl: z.string().url(),
  pageScope: z.array(z.string()).default(['*']),
  frequency: z.number().int().min(1).default(1),
  skipDuration: z.number().int().min(0).default(5),
  active: z.boolean().default(true)
});

const settingsBodySchema = z.object({
  siteName: z.string().min(2),
  logoUrl: z.string().url().or(z.literal('')),
  copyright: z.string().min(2),
  seoTitle: z.string().min(2),
  seoDescription: z.string().min(10),
  supportEmail: z.string().email(),
  analytics: z.object({
    visitsDaily: z.number().int().min(0),
    visitsWeekly: z.number().int().min(0),
    visitsMonthly: z.number().int().min(0),
    uniqueVisitors: z.number().int().min(0)
  })
});

const adminBodySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['SUPER_ADMIN', 'EDITOR', 'ANALYST']),
  permissions: z.array(z.string()).default([])
});

export const getDashboard = asyncHandler(async (_req, res) => {
  const dashboard = await getDashboardMetrics();
  res.json(apiResponse('Dashboard loaded', dashboard));
});

export const getGames = asyncHandler(async (_req, res) => {
  const games = await Game.find().sort({ createdAt: -1 });
  res.json(apiResponse('Games loaded', games));
});

export const createGame = asyncHandler(async (req, res) => {
  const payload = gameBodySchema.parse(req.body);
  const game = await Game.create({
    ...payload,
    name: sanitizeText(payload.name),
    description: sanitizeText(payload.description),
    developerName: sanitizeText(payload.developerName),
    releaseDate: payload.releaseDate ? new Date(payload.releaseDate) : new Date()
  });
  res.status(201).json(apiResponse('Game created', game));
});

export const updateGame = asyncHandler(async (req, res) => {
  const payload = gameBodySchema.partial().parse(req.body);
  const game = await Game.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!game) throw new ApiError(404, 'Game not found');
  res.json(apiResponse('Game updated', game));
});

export const deleteGame = asyncHandler(async (req, res) => {
  const game = await Game.findByIdAndDelete(req.params.id);
  if (!game) throw new ApiError(404, 'Game not found');
  await Review.deleteMany({ gameId: game._id });
  res.json(apiResponse('Game deleted'));
});

export const importGameFromGithub = asyncHandler(async (req, res) => {
  const schema = z.object({ repoFullName: z.string().min(3) });
  const { repoFullName } = schema.parse(req.body);
  const imported = await importGithubGame(repoFullName);
  res.json(apiResponse('GitHub game metadata loaded', imported));
});

export const getCategoriesAdmin = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
  res.json(apiResponse('Categories loaded', categories));
});

export const createCategory = asyncHandler(async (req, res) => {
  const payload = categoryBodySchema.parse(req.body);
  const category = await Category.create({ ...payload, name: sanitizeText(payload.name) });
  res.status(201).json(apiResponse('Category created', category));
});

export const updateCategory = asyncHandler(async (req, res) => {
  const payload = categoryBodySchema.partial().parse(req.body);
  const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(apiResponse('Category updated', category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  await Game.updateMany({ categories: category._id }, { $pull: { categories: category._id, categoryLabels: category.name } });
  res.json(apiResponse('Category deleted'));
});

export const getReviewsAdmin = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 }).populate('gameId', 'name slug');
  res.json(apiResponse('Reviews loaded', reviews));
});

export const updateReview = asyncHandler(async (req, res) => {
  const payload = reviewBodySchema.parse(req.body);
  const review = await Review.findByIdAndUpdate(req.params.id, { ...payload, comment: sanitizeText(payload.comment) }, { new: true });
  if (!review) throw new ApiError(404, 'Review not found');
  res.json(apiResponse('Review updated', review));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  res.json(apiResponse('Review deleted'));
});

export const getAds = asyncHandler(async (_req, res) => {
  const ads = await AdSlot.find().sort({ placement: 1 });
  res.json(apiResponse('Ads loaded', ads));
});

export const createAd = asyncHandler(async (req, res) => {
  const payload = adBodySchema.parse(req.body);
  const ad = await AdSlot.create(payload);
  res.status(201).json(apiResponse('Ad created', ad));
});

export const updateAd = asyncHandler(async (req, res) => {
  const payload = adBodySchema.partial().parse(req.body);
  const ad = await AdSlot.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!ad) throw new ApiError(404, 'Ad not found');
  res.json(apiResponse('Ad updated', ad));
});

export const deleteAd = asyncHandler(async (req, res) => {
  const ad = await AdSlot.findByIdAndDelete(req.params.id);
  if (!ad) throw new ApiError(404, 'Ad not found');
  res.json(apiResponse('Ad deleted'));
});

export const incrementAdImpression = asyncHandler(async (req, res) => {
  const ad = await AdSlot.findByIdAndUpdate(req.params.id, { $inc: { impressions: 1 } }, { new: true });
  if (!ad) throw new ApiError(404, 'Ad not found');
  res.json(apiResponse('Ad impression tracked', ad));
});

export const incrementAdClick = asyncHandler(async (req, res) => {
  const ad = await AdSlot.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } }, { new: true });
  if (!ad) throw new ApiError(404, 'Ad not found');
  res.json(apiResponse('Ad click tracked', ad));
});

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await SiteSetting.findOne();
  res.json(apiResponse('Settings loaded', settings));
});

export const updateSettings = asyncHandler(async (req, res) => {
  const payload = settingsBodySchema.parse(req.body);
  const settings = await SiteSetting.findOneAndUpdate({}, payload, { new: true, upsert: true });
  res.json(apiResponse('Settings updated', settings));
});

export const getAdmins = asyncHandler(async (_req, res) => {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  res.json(apiResponse('Admins loaded', admins));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const payload = adminBodySchema.parse(req.body);
  const admin = await Admin.create(payload);
  res.status(201).json(apiResponse('Admin created', { ...admin.toObject(), password: undefined }));
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) throw new ApiError(404, 'Admin not found');
  res.json(apiResponse('Admin deleted'));
});

export const exportBackup = asyncHandler(async (_req, res) => {
  const [games, categories, reviews, ads, settings, admins] = await Promise.all([
    Game.find(),
    Category.find(),
    Review.find(),
    AdSlot.find(),
    SiteSetting.find(),
    Admin.find().select('-password')
  ]);
  res.json(apiResponse('Backup exported', { games, categories, reviews, ads, settings, admins, exportedAt: new Date() }));
});

export const restoreBackupPreview = asyncHandler(async (req, res) => {
  const schema = z.object({
    games: z.array(z.record(z.any())).default([]),
    categories: z.array(z.record(z.any())).default([]),
    reviews: z.array(z.record(z.any())).default([]),
    ads: z.array(z.record(z.any())).default([])
  });
  const backup = schema.parse(req.body);
  res.json(apiResponse('Backup payload validated', {
    games: backup.games.length,
    categories: backup.categories.length,
    reviews: backup.reviews.length,
    ads: backup.ads.length
  }));
});
