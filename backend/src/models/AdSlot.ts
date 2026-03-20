import mongoose, { InferSchemaType } from 'mongoose';

const adSlotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    placement: {
      type: String,
      enum: ['HEADER_BANNER', 'SIDEBAR_VERTICAL', 'PRE_ROLL', 'IN_GAME_TOP', 'IN_GAME_BOTTOM', 'GRID_INLINE_4', 'GRID_INLINE_8'],
      required: true,
      unique: true
    },
    type: { type: String, enum: ['IMAGE', 'VIDEO', 'HTML'], default: 'IMAGE' },
    mediaUrl: { type: String, required: true, trim: true },
    redirectUrl: { type: String, required: true, trim: true },
    pageScope: [{ type: String, trim: true }],
    frequency: { type: Number, default: 1 },
    skipDuration: { type: Number, default: 5 },
    active: { type: Boolean, default: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  },
  { timestamps: true }
);

adSlotSchema.virtual('ctr').get(function ctr() {
  return this.impressions > 0 ? Number(((this.clicks / this.impressions) * 100).toFixed(2)) : 0;
});

export type AdSlotDocument = InferSchemaType<typeof adSlotSchema>;
export const AdSlot = mongoose.model<AdSlotDocument>('AdSlot', adSlotSchema);
