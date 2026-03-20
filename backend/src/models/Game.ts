import mongoose, { InferSchemaType } from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    coverImage: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }],
    categoryLabels: [{ type: String, trim: true }],
    embedUrl: { type: String, required: true, trim: true },
    localEmbedPath: { type: String, trim: true, default: '' },
    launchMode: { type: String, enum: ['PAGE', 'MODAL'], default: 'PAGE' },
    developerName: { type: String, required: true, trim: true },
    githubRepo: { type: String, trim: true, default: '' },
    licenseName: { type: String, trim: true, default: '' },
    licenseUrl: { type: String, trim: true, default: '' },
    releaseDate: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    playCount: { type: Number, default: 0 },
    avgPlayTime: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export type GameDocument = InferSchemaType<typeof gameSchema>;
export const Game = mongoose.model<GameDocument>('Game', gameSchema);
