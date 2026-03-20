import { Router } from 'express';
import {
  getCategories,
  getGameBySlug,
  getHomeData,
  getNewReleases,
  getPopularGames,
  getRatingsLeaderboard,
  getSiteSettings,
  submitContactMessage,
  submitReview,
  trackGamePlay
} from '../controllers/publicController.js';

const router = Router();

router.get('/home', getHomeData);
router.get('/categories', getCategories);
router.get('/games/popular', getPopularGames);
router.get('/games/new', getNewReleases);
router.get('/ratings', getRatingsLeaderboard);
router.get('/games/:slug', getGameBySlug);
router.post('/games/:slug/reviews', submitReview);
router.post('/games/:slug/play', trackGamePlay);
router.post('/contact', submitContactMessage);
router.get('/settings', getSiteSettings);

export default router;
