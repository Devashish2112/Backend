import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import recordsService from '../services/records.service';
import { HTTP_STATUS } from '../config/constants';

export class RecordsController {
  async createRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const record = await recordsService.createRecord(userId, req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: record,
        message: 'Financial record created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecords(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const { page, limit, type, category, startDate, endDate, userId: filterUserId } = req.query;
      
      const filters = {
        type: type as any,
        category: category as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        userId: filterUserId as string,
      };

      const pagination = {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      };

      const result = await recordsService.getRecords(userId, userRole, filters, pagination);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const record = await recordsService.getRecordById(id, userId, userRole);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const record = await recordsService.updateRecord(id, userId, userRole, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: record,
        message: 'Financial record updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecord(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      
      const result = await recordsService.deleteRecord(id, userId, userRole);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RecordsController();
