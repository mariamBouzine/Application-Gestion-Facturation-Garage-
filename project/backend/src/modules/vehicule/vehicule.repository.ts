import { Vehicule } from '@prisma/client';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PaginationQuery, PaginationMeta } from '@/types';

export class VehiculeRepository extends BaseRepository<Vehicule> {
  constructor() {
    super('vehicule');
  }

  async findById(id: string): Promise<Vehicule | null> {
    return this.prisma.vehicule.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            numeroClient: true
          }
        },
        _count: {
          select: {
            devis: true,
            ordres: true
          }
        }
      }
    });
  }

  async findByImmatriculation(immatriculation: string): Promise<Vehicule | null> {
    return this.prisma.vehicule.findUnique({
      where: { immatriculation }
    });
  }

  async findMany(query: PaginationQuery): Promise<{ data: Vehicule[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vehicule.findMany({
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
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
      }),
      this.prisma.vehicule.count()
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async create(data: Omit<Vehicule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicule> {
    return this.prisma.vehicule.create({
      data,
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

  async update(id: string, data: Partial<Vehicule>): Promise<Vehicule> {
    return this.prisma.vehicule.update({
      where: { id },
      data,
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

  async delete(id: string): Promise<void> {
    await this.prisma.vehicule.delete({
      where: { id }
    });
  }

  async search(searchTerm: string, query: PaginationQuery): Promise<{ data: Vehicule[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const whereClause = {
      OR: [
        { immatriculation: { contains: searchTerm, mode: 'insensitive' as const } },
        { marque: { contains: searchTerm, mode: 'insensitive' as const } },
        { modele: { contains: searchTerm, mode: 'insensitive' as const } },
        { client: { nom: { contains: searchTerm, mode: 'insensitive' as const } } },
        { client: { prenom: { contains: searchTerm, mode: 'insensitive' as const } } }
      ]
    };

    const [data, total] = await Promise.all([
      this.prisma.vehicule.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
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
      }),
      this.prisma.vehicule.count({ where: whereClause })
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }
}