import { Client } from '@prisma/client';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PaginationQuery, PaginationMeta } from '@/types';

export class ClientRepository extends BaseRepository<Client> {
  constructor() {
    super('client');
  }

  async findById(id: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        vehicules: true,
        _count: {
          select: {
            vehicules: true,
            devis: true,
            ordres: true
          }
        }
      }
    });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { email }
    });
  }

  async findMany(query: PaginationQuery): Promise<{ data: Client[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
        include: {
          _count: {
            select: {
              vehicules: true,
              devis: true,
              ordres: true
            }
          }
        }
      }),
      this.prisma.client.count()
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async create(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    // Generate client number
    const count = await this.prisma.client.count();
    const numeroClient = `CLI-${String(count + 1).padStart(3, '0')}`;

    return this.prisma.client.create({
      data: {
        ...data,
        numeroClient
      }
    });
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    return this.prisma.client.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id }
    });
  }

  async search(searchTerm: string, query: PaginationQuery): Promise<{ data: Client[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const whereClause = {
      OR: [
        { nom: { contains: searchTerm, mode: 'insensitive' as const } },
        { prenom: { contains: searchTerm, mode: 'insensitive' as const } },
        { email: { contains: searchTerm, mode: 'insensitive' as const } },
        { numeroClient: { contains: searchTerm, mode: 'insensitive' as const } },
        { entreprise: { contains: searchTerm, mode: 'insensitive' as const } }
      ]
    };

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
        include: {
          _count: {
            select: {
              vehicules: true,
              devis: true,
              ordres: true
            }
          }
        }
      }),
      this.prisma.client.count({ where: whereClause })
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }
}