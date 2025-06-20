import { PrismaClient } from '@prisma/client';
import { prisma } from '@/database/prisma';
import { PaginationQuery, PaginationMeta } from '@/types';

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected modelName: string;

  constructor(modelName: string) {
    this.prisma = prisma;
    this.modelName = modelName;
  }

  protected buildPaginationMeta(
    total: number,
    page: number,
    limit: number
  ): PaginationMeta {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  protected buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    if (!sortBy) return { createdAt: sortOrder };
    return { [sortBy]: sortOrder };
  }

  abstract findById(id: string): Promise<T | null>;
  abstract findMany(query: PaginationQuery): Promise<{ data: T[]; meta: PaginationMeta }>;
  abstract create(data: any): Promise<T>;
  abstract update(id: string, data: any): Promise<T>;
  abstract delete(id: string): Promise<void>;
}