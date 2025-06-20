import { Vehicule } from '@prisma/client';
import { VehiculeRepository } from './vehicule.repository';
import { AppError } from '@/middleware/errorHandler';
import { PaginationQuery, PaginationMeta } from '@/types';

export class VehiculeService {
  private vehiculeRepository: VehiculeRepository;

  constructor() {
    this.vehiculeRepository = new VehiculeRepository();
  }

  async getVehicules(query: PaginationQuery): Promise<{ data: Vehicule[]; meta: PaginationMeta }> {
    return this.vehiculeRepository.findMany(query);
  }

  async getVehiculeById(id: string): Promise<Vehicule> {
    const vehicule = await this.vehiculeRepository.findById(id);
    if (!vehicule) {
      throw new AppError('Véhicule non trouvé', 404);
    }
    return vehicule;
  }

  async createVehicule(data: Omit<Vehicule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicule> {
    // Check if immatriculation already exists
    const existingVehicule = await this.vehiculeRepository.findByImmatriculation(data.immatriculation);
    if (existingVehicule) {
      throw new AppError('Un véhicule avec cette immatriculation existe déjà', 400);
    }

    return this.vehiculeRepository.create(data);
  }

  async updateVehicule(id: string, data: Partial<Vehicule>): Promise<Vehicule> {
    // Check if vehicule exists
    await this.getVehiculeById(id);

    // If immatriculation is being updated, check for duplicates
    if (data.immatriculation) {
      const existingVehicule = await this.vehiculeRepository.findByImmatriculation(data.immatriculation);
      if (existingVehicule && existingVehicule.id !== id) {
        throw new AppError('Un véhicule avec cette immatriculation existe déjà', 400);
      }
    }

    return this.vehiculeRepository.update(id, data);
  }

  async deleteVehicule(id: string): Promise<void> {
    // Check if vehicule exists
    await this.getVehiculeById(id);

    // Check if vehicule has associated records
    const vehicule = await this.vehiculeRepository.findById(id);
    if (vehicule && (vehicule._count?.devis > 0 || vehicule._count?.ordres > 0)) {
      throw new AppError('Impossible de supprimer un véhicule avec des devis ou ODR associés', 400);
    }

    await this.vehiculeRepository.delete(id);
  }

  async searchVehicules(searchTerm: string, query: PaginationQuery): Promise<{ data: Vehicule[]; meta: PaginationMeta }> {
    if (!searchTerm.trim()) {
      return this.getVehicules(query);
    }
    return this.vehiculeRepository.search(searchTerm, query);
  }
}