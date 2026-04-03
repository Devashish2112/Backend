import { Response, NextFunction } from 'express';
import { verifyToken, JWTError } from '../utils/jwt';
import { AuthRequest } from '../types';
import { HTTP_STATUS, ERROR_CODES, HEADERS } from '../config/constants';

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers[HEADERS.AUTHORIZATION] as string;

    if (!authHeader) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'No authorization token provided',
        },
      });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid authorization header format. Use: Bearer <token>',
        },
      });
      return;
    }

    const token = parts[1];
    const payload = verifyToken(token);

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof JWTError) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication failed',
      },
    });
  }
};
