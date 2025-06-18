import { OrdreReparation } from '@prisma/client';
import { BaseRepository } from '@/shared/repositories/base.repository';
import { PaginationQuery, PaginationMeta } from '@/types';

export class ODRRepository extends BaseRepository<OrdreReparation> {
  constructor() {
    super('ordreReparation');
  }

  async findById(id: string): Promise<OrdreReparation | null> {
    return this.prisma.ordreReparation.findUnique({
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

  async findMany(query: PaginationQuery): Promise<{ data: OrdreReparation[]; meta: PaginationMeta }> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.ordreReparation.findMany({
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
      this.prisma.ordreReparation.count()
    ]);

    return {
      data,
      meta: this.buildPaginationMeta(total, page, limit)
    };
  }

  async create(data: any): Promise<OrdreReparation> {
    const { articles, ...odrData } = data;

    return this.prisma.ordreReparation.create({
      data: {
        ...odrData,
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

  async update(id: string, data: Partial<OrdreReparation>): Promise<OrdreReparation> {
    return this.prisma.ordreReparation.update({
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
    await this.prisma.ordreReparation.delete({
      where: { id }
    });
  }
}