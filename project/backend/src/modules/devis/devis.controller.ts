import { Request, Response } from 'express';
import { DevisService } from './devis.service';
import { ApiResponse, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class DevisController {
  private devisService: DevisService;

  constructor() {
    this.devisService = new DevisService();
  }

  getDevis = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.devisService.getDevis(query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getDevisById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const devis = await this.devisService.getDevisById(id);

    const response: ApiResponse = {
      success: true,
      data: devis
    };

    res.json(response);
  };

  createDevis = async (req: Request, res: Response): Promise<void> => {
    const devis = await this.devisService.createDevis(req.body);

    logger.info(`Devis created: ${devis.id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: devis,
      message: 'Devis créé avec succès'
    };

    res.status(201).json(response);
  };

  updateDevis = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const devis = await this.devisService.updateDevis(id, req.body);

    logger.info(`Devis updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: devis,
      message: 'Devis mis à jour avec succès'
    };

    res.json(response);
  };

  deleteDevis = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.devisService.deleteDevis(id);

    logger.info(`Devis deleted: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      message: 'Devis supprimé avec succès'
    };

    res.json(response);
  };

  updateDevisStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { statut } = req.body;

    const devis = await this.devisService.updateDevisStatus(id, statut);

    logger.info(`Devis status updated: ${id} to ${statut}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: devis,
      message: 'Statut du devis mis à jour avec succès'
    };

    res.json(response);
  };
}