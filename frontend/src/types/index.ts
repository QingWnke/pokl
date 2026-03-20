export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  displayOrder: number;
  parentId?: string | null;
  visible: boolean;
}

export interface Game {
  _id: string;
  name: string;
  slug: string;
  coverImage: string;
  description: string;
  categories: string[];
  categoryLabels: string[];
  embedUrl: string;
  localEmbedPath?: string;
  launchMode: 'PAGE' | 'MODAL';
  developerName: string;
  githubRepo: string;
  licenseName: string;
  licenseUrl: string;
  releaseDate: string;
  published: boolean;
  featured?: boolean;
  playCount: number;
  avgPlayTime: number;
  ratingAverage: number;
  ratingCount: number;
}

export interface Review {
  _id: string;
  gameId: string | { _id: string; name: string; slug: string };
  authorName: string;
  rating: number;
  comment: string;
  pinned: boolean;
  spam: boolean;
  approved: boolean;
  createdAt: string;
}

export interface AdSlot {
  _id: string;
  name: string;
  placement: string;
  type: 'IMAGE' | 'VIDEO' | 'HTML';
  mediaUrl: string;
  redirectUrl: string;
  pageScope: string[];
  frequency: number;
  skipDuration: number;
  active: boolean;
  impressions: number;
  clicks: number;
  ctr?: number;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  logoUrl: string;
  copyright: string;
  seoTitle: string;
  seoDescription: string;
  supportEmail: string;
  analytics: {
    visitsDaily: number;
    visitsWeekly: number;
    visitsMonthly: number;
    uniqueVisitors: number;
  };
}

export interface HomePayload {
  categories: Category[];
  games: Game[];
  ads: AdSlot[];
  settings: SiteSettings;
}

export interface RatingsPayload {
  topRatedGames: Game[];
  latestReviews: Review[];
}

export interface GameDetailPayload {
  game: Game;
  reviews: Review[];
  relatedGames: Game[];
  ads: AdSlot[];
}

export interface DashboardPayload {
  overview: {
    totalGames: number;
    publishedGames: number;
    totalReviews: number;
    visitsDaily: number;
    visitsWeekly: number;
    visitsMonthly: number;
    uniqueVisitors: number;
  };
  topGames: Pick<Game, 'name' | 'playCount' | 'ratingAverage'>[];
  adPerformance: AdSlot[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}
