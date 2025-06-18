import { Prestation } from '@prisma/client';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PaginationQuery, PaginationMeta, TypeService } from '@/types';

export class PrestationRepository extends BaseRepository<Prestation> {
  constructor() {
    super('prestation');
  }

  async findById(id: string): Promise<Prestation | null> {
    return this.prisma.prestation.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articlesDevis: true,
            articlesODR: true
          }
        }
      }
    });
  }

  async findMany(query: PaginationQuery): Promise<{ data: Prestation[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.prestation.findMany({
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder)
      }),
      this.prisma.prestation.count()
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async findByType(typeService: TypeService, query: PaginationQuery): Promise<{ data: Prestation[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const whereClause = { typeService };

    const [data, total] = await Promise.all([
      this.prisma.prestation.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder)
      }),
      this.prisma.prestation.count({ where: whereClause })
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async create(data: Omit<Prestation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prestation> {
    return this.prisma.prestation.create({
      data
    });
  }

  async update(id: string, data: Partial<Prestation>): Promise<Prestation> {
    return this.prisma.prestation.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.prestation.delete({
      where: { id }
    });
  }
}