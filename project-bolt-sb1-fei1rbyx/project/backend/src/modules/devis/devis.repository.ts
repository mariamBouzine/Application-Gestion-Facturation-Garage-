import { Devis } from '@prisma/client';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PaginationQuery, PaginationMeta } from '@/types';

export class DevisRepository extends BaseRepository<Devis> {
  constructor() {
    super('devis');
  }

  async findById(id: string): Promise<Devis | null> {
    return this.prisma.devis.findUnique({
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
        vehicule: {
          select: {
            id: true,
            immatriculation: true,
            marque: true,
            modele: true
          }
        },
        articles: {
          include: {
            prestation: true
          }
        }
      }
    });
  }

  async findMany(query: PaginationQuery): Promise<{ data: Devis[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.devis.findMany({
        skip,
        take: limit,
        orderBy: this.buildOrderBy(sortBy, sortOrder),
        include: {
          client: {
            select: {
              nom: true,
              prenom: true
            }
          },
          vehicule: {
            select: {
              immatriculation: true,
              marque: true,
              modele: true
            }
          }
        }
      }),
      this.prisma.devis.count()
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async create(data: any): Promise<Devis> {
    const { articles, ...devisData } = data;

    return this.prisma.devis.create({
      data: {
        ...devisData,
        articles: {
          create: articles.map((article: any, index: number) => ({
            numeroArticle: `ART-${index + 1}`,
            designation: article.designation,
            prixUnitaireTTC: article.prixUnitaireTTC,
            quantite: article.quantite,
            totalTTC: article.prixUnitaireTTC * article.quantite,
            prestationId: article.prestationId
          }))
        }
      },
      include: {
        client: true,
        vehicule: true,
        articles: true
      }
    });
  }

  async update(id: string, data: Partial<Devis>): Promise<Devis> {
    return this.prisma.devis.update({
      where: { id },
      data,
      include: {
        client: true,
        vehicule: true,
        articles: true
      }
    });
  }

  async delete(id: string): Promise<void> => {
    await this.prisma.devis.delete({
      where: { id }
    });
  }
}