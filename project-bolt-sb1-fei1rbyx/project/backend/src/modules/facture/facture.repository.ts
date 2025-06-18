import { Facture } from '@prisma/client';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PaginationQuery, PaginationMeta } from '@/types';

export class FactureRepository extends BaseRepository<Facture> {
  constructor() {
    super('facture');
  }

  async findById(id: string): Promise<Facture | null> {
    return this.prisma.facture.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            numeroClient: true
          }
        }
      }
    });
  }

  async findMany(query: PaginationQuery): Promise<{ data: Facture[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.facture.findMany({
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
        include: {
          client: {
            select: {
              nom: true,
              prenom: true
            }
          }
        }
      }),
      this.prisma.facture.count()
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async create(data: any): Promise<Facture> {
    return this.prisma.facture.create({
      data,
      include: {
        client: true
      }
    });
  }

  async update(id: string, data: Partial<Facture>): Promise<Facture> {
    return this.prisma.facture.update({
      where: { id },
      data,
      include: {
        client: true
      }
    });
  }

  async delete(id: string): Promise<void> => {
    await this.prisma.facture.delete({
      where: { id }
    });
  }
}