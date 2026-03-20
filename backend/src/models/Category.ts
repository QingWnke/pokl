import mongoose, { InferSchemaType } from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true },
    icon: { type: String, default: '🎮' },
    displayOrder: { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    visible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);
