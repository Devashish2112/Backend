import { prisma } from '../config/database';
import { Role, RecordType } from '@prisma/client';
import { DashboardSummary, DashboardTrends } from '../types';

export class DashboardService {
  async getSummary(userId: string, userRole: Role): Promise<DashboardSummary> {
    const where: any = {
      deletedAt: null,
    };

    // Role-based filtering
    if (userRole !== Role.ADMIN) {
      where.userId = userId;
    }

    const [records, incomeSum, expenseSum] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        select: {
          amount: true,
          type: true,
          category: true,
        },
      }),
      prisma.financialRecord.aggregate({
        where: {
          ...where,
          type: RecordType.INCOME,
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.financialRecord.aggregate({
        where: {
          ...where,
          type: RecordType.EXPENSE,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalIncome = Number(incomeSum._sum.amount || 0);
    const totalExpenses = Number(expenseSum._sum.amount || 0);
    const balance = totalIncome - totalExpenses;

    // Calculate category breakdown
    const categoryMap = new Map<string, { amount: number; type: RecordType; count: number }>();

    records.forEach((record) => {
      const key = `${record.category}-${record.type}`;
      if (categoryMap.has(key)) {
        const existing = categoryMap.get(key)!;
        existing.amount += Number(record.amount);
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          amount: Number(record.amount),
          type: record.type,
          count: 1,
        });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([key, value]) => ({
      category: key.split('-')[0],
      amount: value.amount,
      type: value.type,
      count: value.count,
    }));

    return {
      totalIncome,
      totalExpenses,
      balance,
      recordCount: records.length,
      categoryBreakdown,
    };
  }

  async getTrends(
    userId: string,
    userRole: Role,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    startDate?: Date,
    endDate?: Date
  ): Promise<DashboardTrends> {
    const where: any = {
      deletedAt: null,
    };

    // Role-based filtering
    if (userRole !== Role.ADMIN) {
      where.userId = userId;
    }

    // Date filtering
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const records = await prisma.financialRecord.findMany({
      where,
      select: {
        date: true,
        amount: true,
        type: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group records by period
    const trendsMap = new Map<string, { income: number; expenses: number }>();

    records.forEach((record) => {
      let dateKey: string;
      const recordDate = new Date(record.date);

      switch (period) {
        case 'daily':
          dateKey = recordDate.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(recordDate);
          weekStart.setDate(recordDate.getDate() - recordDate.getDay());
          dateKey = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
        default:
          dateKey = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
          break;
      }

      if (!trendsMap.has(dateKey)) {
        trendsMap.set(dateKey, { income: 0, expenses: 0 });
      }

      const trend = trendsMap.get(dateKey)!;
      const amount = Number(record.amount);

      if (record.type === RecordType.INCOME) {
        trend.income += amount;
      } else {
        trend.expenses += amount;
      }
    });

    const trends = Array.from(trendsMap.entries())
      .map(([date, data]) => ({
        date,
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      trends,
      period,
    };
  }
}

export default new DashboardService();
