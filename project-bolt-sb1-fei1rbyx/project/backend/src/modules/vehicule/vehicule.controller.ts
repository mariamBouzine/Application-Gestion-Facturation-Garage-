import { Request, Response } from 'express';
import { VehiculeService } from './vehicule.service';
import { ApiResponse, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class VehiculeController {
  private vehiculeService: VehiculeService;

  constructor() {
    this.vehiculeService = new VehiculeService();
  }

  getVehicules = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.vehiculeService.getVehicules(query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getVehiculeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const vehicule = await this.vehiculeService.getVehiculeById(id);

    const response: ApiResponse = {
      success: true,
      data: vehicule
    };

    res.json(response);
  };

  createVehicule = async (req: Request, res: Response): Promise<void> => {
    const vehicule = await this.vehiculeService.createVehicule(req.body);

    logger.info(`Vehicule created: ${vehicule.id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: vehicule,
      message: 'Véhicule créé avec succès'
    };

    res.status(201).json(response);
  };

  updateVehicule = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const vehicule = await this.vehiculeService.updateVehicule(id, req.body);

    logger.info(`Vehicule updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: vehicule,
      message: 'Véhicule mis à jour avec succès'
    };

    res.json(response);
  };

  deleteVehicule = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.vehiculeService.deleteVehicule(id);

    logger.info(`Vehicule deleted: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      message: 'Véhicule supprimé avec succès'
    };

    res.json(response);
  };

  searchVehicules = async (req: Request, res: Response): Promise<void> => {
    const searchTerm = req.query.q as string || '';
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.vehiculeService.searchVehicules(searchTerm, query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };
}