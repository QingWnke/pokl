import { AdSlot } from '../models/AdSlot.js';
import { Game } from '../models/Game.js';
import { Review } from '../models/Review.js';
import { SiteSetting } from '../models/SiteSetting.js';

export const getDashboardMetrics = async () => {
  const [settings, totalGames, publishedGames, totalReviews, topGames, adSlots] = await Promise.all([
    SiteSetting.findOne(),
    Game.countDocuments(),
    Game.countDocuments({ published: true }),
    Review.countDocuments(),
    Game.find().sort({ playCount: -1 }).limit(5).select('name playCount ratingAverage'),
    AdSlot.find().select('name placement impressions clicks')
  ]);

  return {
    overview: {
      totalGames,
      publishedGames,
      totalReviews,
      visitsDaily: settings?.analytics.visitsDaily ?? 0,
      visitsWeekly: settings?.analytics.visitsWeekly ?? 0,
      visitsMonthly: settings?.analytics.visitsMonthly ?? 0,
      uniqueVisitors: settings?.analytics.uniqueVisitors ?? 0
    },
    topGames,
    adPerformance: adSlots.map((slot) => ({
      ...slot.toObject(),
      ctr: slot.impressions > 0 ? Number(((slot.clicks / slot.impressions) * 100).toFixed(2)) : 0
    }))
  };
};
