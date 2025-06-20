import { OrdreReparation } from '@prisma/client';
import { ODRRepository } from './odr.repository';
import { AppError } from '@/middleware/errorHandler';
import { PaginationQuery, PaginationMeta, StatutODR } from '@/types';

export class ODRService {
  private odrRepository: ODRRepository;

  constructor() {
    this.odrRepository = new ODRRepository();
  }

  async getODRs(query: PaginationQuery): Promise<{ data: OrdreReparation[]; meta: PaginationMeta }> {
    return this.odrRepository.findMany(query);
  }

  async getODRById(id: string): Promise<OrdreReparation> {
    const odr = await this.odrRepository.findById(id);
    if (!odr) {
      throw new AppError('ODR non trouvé', 404);
    }
    return odr;
  }

  async createODR(data: any): Promise<OrdreReparation> {
    // Generate ODR number
    const count = await this.odrRepository.prisma.ordreReparation.count();
    const numeroODR = `ODR-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Calculate total
    const montantTotal = data.articles.reduce((sum: number, article: any) => 
      sum + (article.prixUnitaireTTC * article.quantite), 0);

    const odrData = {
      ...data,
      numeroODR,
      montantTotal
    };

    return this.odrRepository.create(odrData);
  }

  async updateODR(id: string, data: Partial<OrdreReparation>): Promise<OrdreReparation> {
    // Check if ODR exists
    await this.getODRById(id);

    return this.odrRepository.update(id, data);
  }

  async updateODRStatus(id: string, statut: StatutODR): Promise<OrdreReparation> {
    // Check if ODR exists
    await this.getODRById(id);

    return this.odrRepository.update(id, { statut });
  }

  async deleteODR(id: string): Promise<void> => {
    // Check if ODR exists
    await this.getODRById(id);

    await this.odrRepository.delete(id);
  }
}