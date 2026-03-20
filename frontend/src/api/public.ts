import { api } from './client';
import { GameDetailPayload, HomePayload, RatingsPayload, SiteSettings } from '../types';

export const publicApi = {
  getHome: async (params?: { category?: string; search?: string }) => (await api.get<{ data: HomePayload }>('/home', { params })).data.data,
  getCategories: async () => (await api.get('/categories')).data.data,
  getPopularGames: async () => (await api.get('/games/popular')).data.data,
  getNewReleases: async () => (await api.get('/games/new')).data.data,
  getRatings: async () => (await api.get<{ data: RatingsPayload }>('/ratings')).data.data,
  getGame: async (slug: string) => (await api.get<{ data: GameDetailPayload }>(`/games/${slug}`)).data.data,
  submitReview: async (slug: string, payload: { authorName: string; rating: number; comment: string }) =>
    (await api.post(`/games/${slug}/reviews`, payload)).data,
  trackPlay: async (slug: string, duration: number) => (await api.post(`/games/${slug}/play`, { duration })).data,
  submitContact: async (payload: { name: string; email: string; message: string }) => (await api.post('/contact', payload)).data,
  getSettings: async () => (await api.get<{ data: SiteSettings }>('/settings')).data.data
};
