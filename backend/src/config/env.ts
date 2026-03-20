import dotenv from 'dotenv';

dotenv.config();

const required = ['JWT_SECRET'];
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/mini_game_portal',
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@example.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin123!',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  githubToken: process.env.GITHUB_TOKEN ?? ''
};
