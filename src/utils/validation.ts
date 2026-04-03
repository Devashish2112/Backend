import { z } from 'zod';
import { Role, Status, RecordType } from '@prisma/client';

// Auth Validation Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// User Management Validation Schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.nativeEnum(Role).optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Invalid role. Must be VIEWER, ANALYST, or ADMIN' }),
  }),
});

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: 'Invalid status. Must be ACTIVE or INACTIVE' }),
  }),
});

// Financial Record Validation Schemas
export const createRecordSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999999999.99, 'Amount is too large'),
  type: z.nativeEnum(RecordType, {
    errorMap: () => ({ message: 'Invalid type. Must be INCOME or EXPENSE' }),
  }),
  category: z.string().min(1, 'Category is required').max(50, 'Category is too long'),
  date: z.coerce.date(),
  description: z.string().max(500, 'Description is too long').optional(),
});

export const updateRecordSchema = z.object({
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(999999999999.99, 'Amount is too large')
    .optional(),
  type: z.nativeEnum(RecordType).optional(),
  category: z.string().min(1).max(50).optional(),
  date: z.coerce.date().optional(),
  description: z.string().max(500).optional(),
});

export const recordFilterSchema = z.object({
  type: z.nativeEnum(RecordType).optional(),
  category: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  userId: z.string().uuid().optional(),
});

// Pagination Validation Schema
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),
});

// Dashboard Validation Schemas
export const dashboardQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  userId: z.string().uuid().optional(),
});

export const trendsQuerySchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly']).optional().default('monthly'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// UUID Validation Schema
export const uuidSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// Export types from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordFilterInput = z.infer<typeof recordFilterSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type DashboardQueryInput = z.infer<typeof dashboardQuerySchema>;
export type TrendsQueryInput = z.infer<typeof trendsQuerySchema>;
export type UuidInput = z.infer<typeof uuidSchema>;
