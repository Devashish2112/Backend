import { prisma } from '../config/database';
import { Role } from '@prisma/client';
import {
  CreateRecordDTO,
  UpdateRecordDTO,
  RecordFilterDTO,
  PaginationParams,
  PaginatedResponse,
} from '../types';
import { AppError } from '../middleware/errorHandler';
import { HTTP_STATUS, ERROR_CODES, PAGINATION } from '../config/constants';

export class RecordsService {
  async createRecord(userId: string, data: CreateRecordDTO) {
    const record = await prisma.financialRecord.create({
      data: {
        userId,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        description: data.description,
      },
    });

    return record;
  }

  async getRecords(
    userId: string,
    userRole: Role,
    filters: RecordFilterDTO,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const page = pagination.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(pagination.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null, // Exclude soft-deleted records
    };

    // Apply role-based filtering
    if (userRole !== Role.ADMIN) {
      where.userId = userId;
    } else if (filters.userId) {
      where.userId = filters.userId;
    }

    // Apply other filters
    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.date.lte = filters.endDate;
      }
    }

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      }),
      prisma.financialRecord.count({ where }),
    ]);

    return {
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecordById(recordId: string, userId: string, userRole: Role) {
    const record = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!record) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Record not found'
      );
    }

    // Check ownership for non-admin users
    if (userRole !== Role.ADMIN && record.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Access denied to this record'
      );
    }

    return record;
  }

  async updateRecord(
    recordId: string,
    userId: string,
    userRole: Role,
    data: UpdateRecordDTO
  ) {
    const existingRecord = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        deletedAt: null,
      },
    });

    if (!existingRecord) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Record not found'
      );
    }

    // Check ownership for non-admin users
    if (userRole !== Role.ADMIN && existingRecord.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'You can only update your own records'
      );
    }

    const record = await prisma.financialRecord.update({
      where: { id: recordId },
      data,
    });

    return record;
  }

  async deleteRecord(recordId: string, userId: string, userRole: Role) {
    const existingRecord = await prisma.financialRecord.findFirst({
      where: {
        id: recordId,
        deletedAt: null,
      },
    });

    if (!existingRecord) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        'Record not found'
      );
    }

    // Only admins can delete
    if (userRole !== Role.ADMIN) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        'Only administrators can delete records'
      );
    }

    // Soft delete
    await prisma.financialRecord.update({
      where: { id: recordId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Record deleted successfully' };
  }
}

export default new RecordsService();
