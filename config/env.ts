import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const env = {
  baseURL: process.env.BASE_URL ?? 'https://automationexercise.com/',
  headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 30000),
  slowMo: Number(process.env.SLOW_MO ?? 0),
} as const;
