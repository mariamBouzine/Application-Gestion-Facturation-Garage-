import { Devis } from '@prisma/client';
import { DevisRepository } from './devis.repository';
import { AppError } from '@/middleware/errorHandler';
import { PaginationQuery, PaginationMeta, StatutDevis } from '@/types';

export class DevisService {
  private devisRepository: DevisRepository;

  constructor() {
    this.devisRepository = new DevisRepository();
  }

  async getDevis(query: PaginationQuery): Promise<{ data: Devis[]; meta: PaginationMeta }> {
    return this.devisRepository.findMany(query);
  }

  async getDevisById(id: string): Promise<Devis> {
    const devis = await this.devisRepository.findById(id);
    if (!devis) {
      throw new AppError('Devis non trouvé', 404);
    }
    return devis;
  }

  async createDevis(data: any): Promise<Devis> {
    // Generate devis number
    const count = await this.devisRepository.prisma.devis.count();
    const numeroDevis = `DEV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Calculate totals
    const totalHT = data.articles.reduce((sum: number, article: any) => 
      sum + (article.prixUnitaireTTC * article.quantite), 0);
    const montantTVA = totalHT * 0.20; // 20% TVA
    const totalTTC = totalHT + montantTVA;

    const devisData = {
      ...data,
      numeroDevis,
      totalHT,
      montantTVA,
      totalTTC
    };

    return this.devisRepository.create(devisData);
  }

  async updateDevis(id: string, data: Partial<Devis>): Promise<Devis> {
    // Check if devis exists
    await this.getDevisById(id);

    return this.devisRepository.update(id, data);
  }

  async updateDevisStatus(id: string, statut: StatutDevis): Promise<Devis> {
    // Check if devis exists
    await this.getDevisById(id);

    return this.devisRepository.update(id, { statut });
  }

  async deleteDevis(id: string): Promise<void> => {
    // Check if devis exists
    await this.getDevisById(id);

    await this.devisRepository.delete(id);
  }
}