import { Facture } from '@prisma/client';
import { FactureRepository } from './facture.repository';
import { AppError } from '@/middleware/errorHandler';
import { PaginationQuery, PaginationMeta, StatutFacture, ModePaiement } from '@/types';

export class FactureService {
  private factureRepository: FactureRepository;

  constructor() {
    this.factureRepository = new FactureRepository();
  }

  async getFactures(query: PaginationQuery): Promise<{ data: Facture[]; meta: PaginationMeta }> {
    return this.factureRepository.findMany(query);
  }

  async getFactureById(id: string): Promise<Facture> {
    const facture = await this.factureRepository.findById(id);
    if (!facture) {
      throw new AppError('Facture non trouvée', 404);
    }
    return facture;
  }

  async createFacture(data: any): Promise<Facture> {
    // Generate facture number
    const count = await this.factureRepository.prisma.facture.count();
    const numeroFacture = `FAC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const factureData = {
      ...data,
      numeroFacture,
      dateEcheance: new Date(data.dateEcheance)
    };

    return this.factureRepository.create(factureData);
  }

  async updateFacture(id: string, data: Partial<Facture>): Promise<Facture> {
    // Check if facture exists
    await this.getFactureById(id);

    return this.factureRepository.update(id, data);
  }

  async updatePaymentStatus(
    id: string, 
    paymentData: {
      statut: StatutFacture;
      modePaiement?: ModePaiement;
      dateReglement?: Date;
    }
  ): Promise<Facture> {
    // Check if facture exists
    await this.getFactureById(id);

    return this.factureRepository.update(id, paymentData);
  }

  async deleteFacture(id: string): Promise<void> => {
    // Check if facture exists
    await this.getFactureById(id);

    await this.factureRepository.delete(id);
  }
}