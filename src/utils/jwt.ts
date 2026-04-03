import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserPayload } from '../types';
import { ERROR_CODES } from '../config/constants';

export class JWTError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'JWTError';
  }
}

export const generateToken = (payload: UserPayload): string => {
  try {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiry,
    } as jwt.SignOptions);
  } catch (error) {
    throw new JWTError(ERROR_CODES.INTERNAL_ERROR, 'Failed to generate token');
  }
};

export const verifyToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new JWTError(ERROR_CODES.TOKEN_EXPIRED, 'Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new JWTError(ERROR_CODES.TOKEN_INVALID, 'Invalid token');
    }
    throw new JWTError(ERROR_CODES.TOKEN_INVALID, 'Token verification failed');
  }
};

export const decodeToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.decode(token) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
