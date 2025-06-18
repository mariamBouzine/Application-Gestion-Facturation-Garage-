import { Request, Response } from 'express';
import { ClientService } from './client.service';
import { ApiResponse, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  getClients = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.clientService.getClients(query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getClientById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const client = await this.clientService.getClientById(id);

    const response: ApiResponse = {
      success: true,
      data: client
    };

    res.json(response);
  };

  createClient = async (req: Request, res: Response): Promise<void> => {
    const client = await this.clientService.createClient(req.body);

    logger.info(`Client created: ${client.id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: client,
      message: 'Client créé avec succès'
    };

    res.status(201).json(response);
  };

  updateClient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const client = await this.clientService.updateClient(id, req.body);

    logger.info(`Client updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: client,
      message: 'Client mis à jour avec succès'
    };

    res.json(response);
  };

  deleteClient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.clientService.deleteClient(id);

    logger.info(`Client deleted: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      message: 'Client supprimé avec succès'
    };

    res.json(response);
  };

  searchClients = async (req: Request, res: Response): Promise<void> => {
    const searchTerm = req.query.q as string || '';
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.clientService.searchClients(searchTerm, query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getClientStats = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.clientService.getClientStats();

    const response: ApiResponse = {
      success: true,
      data: stats
    };

    res.json(response);
  };
}