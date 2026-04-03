import { Role, Status, RecordType } from '@prisma/client';

// Role Constants
export const ROLES = {
  VIEWER: Role.VIEWER,
  ANALYST: Role.ANALYST,
  ADMIN: Role.ADMIN,
} as const;

export const ROLE_HIERARCHY = {
  [Role.VIEWER]: 1,
  [Role.ANALYST]: 2,
  [Role.ADMIN]: 3,
} as const;

// Status Constants
export const USER_STATUS = {
  ACTIVE: Status.ACTIVE,
  INACTIVE: Status.INACTIVE,
} as const;

// Record Type Constants
export const RECORD_TYPES = {
  INCOME: RecordType.INCOME,
  EXPENSE: RecordType.EXPENSE,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// JWT Constants
export const JWT = {
  DEFAULT_EXPIRY: '24h',
  ALGORITHM: 'HS256' as const,
} as const;

// Bcrypt Constants
export const BCRYPT = {
  DEFAULT_ROUNDS: 10,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Auth Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  
  // Database Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Request Headers
export const HEADERS = {
  AUTHORIZATION: 'authorization',
  CONTENT_TYPE: 'content-type',
} as const;

// Categories (Common financial categories)
export const COMMON_CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Bonus', 'Investment', 'Other Income'],
  EXPENSE: [
    'Rent',
    'Groceries',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Education',
    'Insurance',
    'Other Expense',
  ],
} as const;

export type RoleType = keyof typeof ROLES;
export type StatusType = keyof typeof USER_STATUS;
export type RecordTypeKey = keyof typeof RECORD_TYPES;
export type ErrorCode = keyof typeof ERROR_CODES;
