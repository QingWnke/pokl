import mongoose, { InferSchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'EDITOR', 'ANALYST'],
      default: 'EDITOR'
    },
    permissions: [{ type: String, trim: true }],
    lastLoginAt: Date
  },
  { timestamps: true }
);

adminSchema.pre('save', async function passwordHash(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.password);
};

export type AdminDocument = InferSchemaType<typeof adminSchema> & {
  comparePassword(password: string): Promise<boolean>;
};

export const Admin = mongoose.model<AdminDocument>('Admin', adminSchema);
