import mongoose, { InferSchemaType } from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
    spam: { type: Boolean, default: false },
    approved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type ReviewDocument = InferSchemaType<typeof reviewSchema>;
export const Review = mongoose.model<ReviewDocument>('Review', reviewSchema);
