import * as dotenv from 'dotenv';
import { convertStringToBoolean } from "../libs/common";
dotenv.config();

// SYSTEM ENVIRONMENT
export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';
export const PROJECT_ID: string = process.env.PROJECT_ID ?? '';
export const PROJECT_NAME: string = process.env.PROJECT_NAME ?? '';
export const PROTOTYPE: string = process.env.PROTOTYPE ?? '';
export const DOMAIN: string = process.env.DOMAIN ?? '';

// API SERVICE
export const ENABLE_API_SERVICE: boolean = convertStringToBoolean(process.env.ENABLE_API_SERVICE);
export const API_PORT: number = Number(process.env.API_PORT);

// CONFIGURATION OF REDIS
export const REDIS_CONFIG_HOST: string = process.env.REDIS_CONFIG_HOST ?? '';
export const REDIS_CONFIG_PORT: number = process.env.REDIS_CONFIG_PORT ? Number(process.env.REDIS_CONFIG_PORT) : 0;

// CONFIGURATION OF JWT
export const JWT_HASH_NAME: string = process.env.JWT_HASH_NAME ?? '';
export const JWT_SECRET: string = process.env.JWT_SECRET ?? '';
export const JWT_SIGNATURE: string = process.env.JWT_SIGNATURE ?? '';
