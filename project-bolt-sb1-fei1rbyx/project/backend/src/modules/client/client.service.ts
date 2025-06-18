import { Client } from '@prisma/client';
import { ClientRepository } from './client.repository';
import { AppError } from '@/middleware/errorHandler';
import { PaginationQuery, PaginationMeta } from '@/types';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async getClients(query: PaginationQuery): Promise<{ data: Client[]; meta: PaginationMeta }> {
    return this.clientRepository.findMany(query);
  }

  async getClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new AppError('Client not found', 404);
    }
    return client;
  }

  async createClient(data: Omit<Client, 'id' | 'numeroClient' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    // Check if email already exists
    const existingClient = await this.clientRepository.findByEmail(data.email);
    if (existingClient) {
      throw new AppError('Un client avec cet email existe déjà', 400);
    }

    return this.clientRepository.create(data);
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    // Check if client exists
    await this.getClientById(id);

    // If email is being updated, check for duplicates
    if (data.email) {
      const existingClient = await this.clientRepository.findByEmail(data.email);
      if (existingClient && existingClient.id !== id) {
        throw new AppError('Un client avec cet email existe déjà', 400);
      }
    }

    return this.clientRepository.update(id, data);
  }

  async deleteClient(id: string): Promise<void> {
    // Check if client exists
    await this.getClientById(id);

    // Check if client has associated records
    const client = await this.clientRepository.findById(id);
    if (client && (client._count?.vehicules > 0 || client._count?.devis > 0 || client._count?.ordres > 0)) {
      throw new AppError('Impossible de supprimer un client avec des véhicules, devis ou ODR associés', 400);
    }

    await this.clientRepository.delete(id);
  }

  async searchClients(searchTerm: string, query: PaginationQuery): Promise<{ data: Client[]; meta: PaginationMeta }> {
    if (!searchTerm.trim()) {
      return this.getClients(query);
    }
    return this.clientRepository.search(searchTerm, query);
  }

  async getClientStats(): Promise<{
    totalClients: number;
    grandsComptes: number;
    nouveauxClientsMois: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalClients, grandsComptes, nouveauxClientsMois] = await Promise.all([
      this.clientRepository.prisma.client.count(),
      this.clientRepository.prisma.client.count({
        where: { typeClient: 'GRAND_COMPTE' }
      }),
      this.clientRepository.prisma.client.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      })
    ]);

    return {
      totalClients,
      grandsComptes,
      nouveauxClientsMois
    };
  }
}