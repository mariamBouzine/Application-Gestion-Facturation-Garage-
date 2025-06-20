import { Request, Response } from 'express';
import { ODRService } from './odr.service';
import { ApiResponse, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class ODRController {
  private odrService: ODRService;

  constructor() {
    this.odrService = new ODRService();
  }

  getODRs = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.odrService.getODRs(query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getODRById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const odr = await this.odrService.getODRById(id);

    const response: ApiResponse = {
      success: true,
      data: odr
    };

    res.json(response);
  };

  createODR = async (req: Request, res: Response): Promise<void> => {
    const odr = await this.odrService.createODR(req.body);

    logger.info(`ODR created: ${odr.id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: odr,
      message: 'ODR créé avec succès'
    };

    res.status(201).json(response);
  };

  updateODR = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const odr = await this.odrService.updateODR(id, req.body);

    logger.info(`ODR updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: odr,
      message: 'ODR mis à jour avec succès'
    };

    res.json(response);
  };

  deleteODR = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.odrService.deleteODR(id);

    logger.info(`ODR deleted: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      message: 'ODR supprimé avec succès'
    };

    res.json(response);
  };

  updateODRStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { statut } = req.body;

    const odr = await this.odrService.updateODRStatus(id, statut);

    logger.info(`ODR status updated: ${id} to ${statut}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: odr,
      message: 'Statut de l\'ODR mis à jour avec succès'
    };

    res.json(response);
  };
}