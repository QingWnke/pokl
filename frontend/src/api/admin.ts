import { api } from './client';

export const adminApi = {
  login: async (payload: { email: string; password: string }) => (await api.post('/auth/login', payload)).data.data,
  getDashboard: async () => (await api.get('/admin/dashboard')).data.data,
  getGames: async () => (await api.get('/admin/games')).data.data,
  createGame: async (payload: unknown) => (await api.post('/admin/games', payload)).data,
  updateGame: async (id: string, payload: unknown) => (await api.patch(`/admin/games/${id}`, payload)).data,
  deleteGame: async (id: string) => (await api.delete(`/admin/games/${id}`)).data,
  importGithub: async (repoFullName: string) => (await api.post('/admin/games/import-github', { repoFullName })).data,
  getCategories: async () => (await api.get('/admin/categories')).data.data,
  createCategory: async (payload: unknown) => (await api.post('/admin/categories', payload)).data,
  updateCategory: async (id: string, payload: unknown) => (await api.patch(`/admin/categories/${id}`, payload)).data,
  deleteCategory: async (id: string) => (await api.delete(`/admin/categories/${id}`)).data,
  getReviews: async () => (await api.get('/admin/reviews')).data.data,
  updateReview: async (id: string, payload: unknown) => (await api.patch(`/admin/reviews/${id}`, payload)).data,
  deleteReview: async (id: string) => (await api.delete(`/admin/reviews/${id}`)).data,
  getAds: async () => (await api.get('/admin/ads')).data.data,
  createAd: async (payload: unknown) => (await api.post('/admin/ads', payload)).data,
  updateAd: async (id: string, payload: unknown) => (await api.patch(`/admin/ads/${id}`, payload)).data,
  deleteAd: async (id: string) => (await api.delete(`/admin/ads/${id}`)).data,
  getSettings: async () => (await api.get('/admin/settings')).data.data,
  updateSettings: async (payload: unknown) => (await api.put('/admin/settings', payload)).data,
  getAdmins: async () => (await api.get('/admin/admins')).data.data,
  createAdmin: async (payload: unknown) => (await api.post('/admin/admins', payload)).data,
  deleteAdmin: async (id: string) => (await api.delete(`/admin/admins/${id}`)).data,
  exportBackup: async () => (await api.get('/admin/backup/export')).data.data
};
