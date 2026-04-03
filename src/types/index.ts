import { Request } from 'express';
import { Role, Status, RecordType } from '@prisma/client';

// User Types
export interface UserPayload {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  status: Status;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

// Auth Types
export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
  };
}

// User Management Types
export interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
  role?: Role;
}

export interface UpdateUserDTO {
  email?: string;
  fullName?: string;
}

export interface UpdateUserRoleDTO {
  role: Role;
}

export interface UpdateUserStatusDTO {
  status: Status;
}

// Financial Record Types
export interface CreateRecordDTO {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  description?: string;
}

export interface UpdateRecordDTO {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: Date;
  description?: string;
}

export interface RecordFilterDTO {
  type?: RecordType;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}

// Dashboard Types
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  recordCount: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  type: RecordType;
  count: number;
}

export interface TrendData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface DashboardTrends {
  trends: TrendData[];
  period: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Export Prisma types
export { Role, Status, RecordType } from '@prisma/client';
