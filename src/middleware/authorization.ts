import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Role } from '@prisma/client';
import { HTTP_STATUS, ERROR_CODES, USER_STATUS } from '../config/constants';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'User not authenticated',
        },
      });
      return;
    }

    // Check if user is active
    if (req.user.status !== USER_STATUS.ACTIVE) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'User account is inactive',
        },
      });
      return;
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        },
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(Role.ADMIN);

export const requireAnalyst = requireRole(Role.ANALYST, Role.ADMIN);

export const requireViewer = requireRole(Role.VIEWER, Role.ANALYST, Role.ADMIN);
