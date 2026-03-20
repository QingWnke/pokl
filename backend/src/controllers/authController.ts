import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { apiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const authValidators = { loginSchema };

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse({ body: req.body }).body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const validPassword = await admin.comparePassword(password);
  if (!validPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = jwt.sign(
    {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );

  res.json(apiResponse('Admin login successful', {
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions
    }
  }));
});
