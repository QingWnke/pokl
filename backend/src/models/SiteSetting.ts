import mongoose, { InferSchemaType } from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'PlayNexus' },
    logoUrl: { type: String, default: '' },
    copyright: { type: String, default: '© 2026 PlayNexus' },
    seoTitle: { type: String, default: 'PlayNexus | HTML5 Mini-Game Portal' },
    seoDescription: {
      type: String,
      default: 'Discover, rate, and play responsive HTML5 mini games with curated open-source picks.'
    },
    supportEmail: { type: String, default: 'support@example.com' },
    analytics: {
      visitsDaily: { type: Number, default: 1200 },
      visitsWeekly: { type: Number, default: 8600 },
      visitsMonthly: { type: Number, default: 32200 },
      uniqueVisitors: { type: Number, default: 18400 }
    }
  },
  { timestamps: true }
);

export type SiteSettingDocument = InferSchemaType<typeof siteSettingSchema>;
export const SiteSetting = mongoose.model<SiteSettingDocument>('SiteSetting', siteSettingSchema);
