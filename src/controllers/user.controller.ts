import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import userService from '../services/user.service';
import { HTTP_STATUS } from '../config/constants';

export class UserController {
  async createUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query;
      const result = await userService.getUsers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.updateUser(id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.updateUserRole(id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
        message: 'User role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.updateUserStatus(id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: user,
        message: 'User status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
