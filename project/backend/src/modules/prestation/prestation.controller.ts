import { Request, Response } from 'express';
import { PrestationService } from './prestation.service';
import { ApiResponse, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class PrestationController {
  private prestationService: PrestationService;

  constructor() {
    this.prestationService = new PrestationService();
  }

  getPrestations = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.prestationService.getPrestations(query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getPrestationsCarrosserie = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.prestationService.getPrestationsByType('CARROSSERIE', query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getPrestationsMecanique = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.prestationService.getPrestationsByType('MECANIQUE', query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getPrestationById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const prestation = await this.prestationService.getPrestationById(id);

    const response: ApiResponse = {
      success: true,
      data: prestation
    };

    res.json(response);
  };

  createPrestation = async (req: Request, res: Response): Promise<void> => {
    const prestation = await this.prestationService.createPrestation(req.body);

    logger.info(`Prestation created: ${prestation.id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: prestation,
      message: 'Prestation créée avec succès'
    };

    res.status(201).json(response);
  };

  updatePrestation = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const prestation = await this.prestationService.updatePrestation(id, req.body);

    logger.info(`Prestation updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: prestation,
      message: 'Prestation mise à jour avec succès'
    };

    res.json(response);
  };

  deletePrestation = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.prestationService.deletePrestation(id);

    logger.info(`Prestation deleted: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      message: 'Prestation supprimée avec succès'
    };

    res.json(response);
  };
}