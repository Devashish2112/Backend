import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  // Server Configuration
  nodeEnv: string;
  port: number;
  
  // Database Configuration
  databaseUrl: string;
  
  // JWT Configuration
  jwtSecret: string;
  jwtExpiry: string;
  
  // Bcrypt Configuration
  bcryptRounds: number;
  
  // CORS Configuration
  corsOrigin: string;
  
  // Rate Limiting Configuration
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value || defaultValue!;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

export const config: Config = {
  // Server
  nodeEnv: getEnvVariable('NODE_ENV', 'development'),
  port: getEnvNumber('PORT', 3000),
  
  // Database
  databaseUrl: getEnvVariable('DATABASE_URL'),
  
  // JWT
  jwtSecret: getEnvVariable('JWT_SECRET'),
  jwtExpiry: getEnvVariable('JWT_EXPIRY', '24h'),
  
  // Bcrypt
  bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 10),
  
  // CORS
  corsOrigin: getEnvVariable('CORS_ORIGIN', '*'),
  
  // Rate Limiting
  rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
  rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
};

export default config;
