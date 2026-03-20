import { Router } from 'express';
import {
  createAd,
  createAdmin,
  createCategory,
  createGame,
  deleteAd,
  deleteAdmin,
  deleteCategory,
  deleteGame,
  deleteReview,
  exportBackup,
  getAdmins,
  getAds,
  getCategoriesAdmin,
  getDashboard,
  getGames,
  getReviewsAdmin,
  getSettings,
  importGameFromGithub,
  incrementAdClick,
  incrementAdImpression,
  restoreBackupPreview,
  updateAd,
  updateCategory,
  updateGame,
  updateReview,
  updateSettings
} from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/dashboard', getDashboard);

router.route('/games').get(getGames).post(requireRole(['SUPER_ADMIN', 'EDITOR']), createGame);
router.post('/games/import-github', requireRole(['SUPER_ADMIN', 'EDITOR']), importGameFromGithub);
router.route('/games/:id').patch(requireRole(['SUPER_ADMIN', 'EDITOR']), updateGame).delete(requireRole(['SUPER_ADMIN']), deleteGame);

router.route('/categories').get(getCategoriesAdmin).post(requireRole(['SUPER_ADMIN', 'EDITOR']), createCategory);
router.route('/categories/:id').patch(requireRole(['SUPER_ADMIN', 'EDITOR']), updateCategory).delete(requireRole(['SUPER_ADMIN']), deleteCategory);

router.get('/reviews', getReviewsAdmin);
router.route('/reviews/:id').patch(requireRole(['SUPER_ADMIN', 'EDITOR']), updateReview).delete(requireRole(['SUPER_ADMIN', 'EDITOR']), deleteReview);

router.route('/ads').get(getAds).post(requireRole(['SUPER_ADMIN', 'EDITOR']), createAd);
router.route('/ads/:id').patch(requireRole(['SUPER_ADMIN', 'EDITOR']), updateAd).delete(requireRole(['SUPER_ADMIN']), deleteAd);
router.post('/ads/:id/impression', incrementAdImpression);
router.post('/ads/:id/click', incrementAdClick);

router.route('/settings').get(getSettings).put(requireRole(['SUPER_ADMIN']), updateSettings);
router.route('/admins').get(requireRole(['SUPER_ADMIN']), getAdmins).post(requireRole(['SUPER_ADMIN']), createAdmin);
router.delete('/admins/:id', requireRole(['SUPER_ADMIN']), deleteAdmin);

router.get('/backup/export', requireRole(['SUPER_ADMIN']), exportBackup);
router.post('/backup/preview', requireRole(['SUPER_ADMIN']), restoreBackupPreview);

export default router;
