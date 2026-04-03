import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import dashboardService from '../services/dashboard.service';
import { HTTP_STATUS } from '../config/constants';

export class DashboardController {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const summary = await dashboardService.getSummary(userId, userRole);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrends(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const { period, startDate, endDate } = req.query;
      
      const trends = await dashboardService.getTrends(
        userId,
        userRole,
        (period as 'daily' | 'weekly' | 'monthly') || 'monthly',
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
