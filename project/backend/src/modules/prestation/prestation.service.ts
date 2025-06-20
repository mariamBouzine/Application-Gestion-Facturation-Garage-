import { Prestation } from '@prisma/client';
import { PrestationRepository } from './prestation.repository';
import { AppError } from '@/middleware/errorHandler';
import { PaginationQuery, PaginationMeta, TypeService } from '@/types';

export class PrestationService {
  private prestationRepository: PrestationRepository;

  constructor() {
    this.prestationRepository = new PrestationRepository();
  }

  async getPrestations(query: PaginationQuery): Promise<{ data: Prestation[]; meta: PaginationMeta }> {
    return this.prestationRepository.findMany(query);
  }

  async getPrestationsByType(typeService: TypeService, query: PaginationQuery): Promise<{ data: Prestation[]; meta: PaginationMeta }> {
    return this.prestationRepository.findByType(typeService, query);
  }

  async getPrestationById(id: string): Promise<Prestation> {
    const prestation = await this.prestationRepository.findById(id);
    if (!prestation) {
      throw new AppError('Prestation non trouvée', 404);
    }
    return prestation;
  }

  async createPrestation(data: Omit<Prestation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prestation> {
    return this.prestationRepository.create(data);
  }

  async updatePrestation(id: string, data: Partial<Prestation>): Promise<Prestation> {
    // Check if prestation exists
    await this.getPrestationById(id);

    return this.prestationRepository.update(id, data);
  }

  async deletePrestation(id: string): Promise<void> {
    // Check if prestation exists
    await this.getPrestationById(id);

    // Check if prestation has associated records
    const prestation = await this.prestationRepository.findById(id);
    if (prestation && (prestation._count?.articlesDevis > 0 || prestation._count?.articlesODR > 0)) {
      throw new AppError('Impossible de supprimer une prestation utilisée dans des devis ou ODR', 400);
    }

    await this.prestationRepository.delete(id);
  }
}