import { Request, Response } from 'express';
import { FactureService } from './facture.service';
import { ApiResponse, PaginationQuery } from '@/types';
import { logger } from '@/utils/logger';

export class FactureController {
  private factureService: FactureService;

  constructor() {
    this.factureService = new FactureService();
  }

  getFactures = async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
    };

    const result = await this.factureService.getFactures(query);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      pagination: result.meta
    };

    res.json(response);
  };

  getFactureById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const facture = await this.factureService.getFactureById(id);

    const response: ApiResponse = {
      success: true,
      data: facture
    };

    res.json(response);
  };

  createFacture = async (req: Request, res: Response): Promise<void> => {
    const facture = await this.factureService.createFacture(req.body);

    logger.info(`Facture created: ${facture.id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: facture,
      message: 'Facture créée avec succès'
    };

    res.status(201).json(response);
  };

  updateFacture = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const facture = await this.factureService.updateFacture(id, req.body);

    logger.info(`Facture updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: facture,
      message: 'Facture mise à jour avec succès'
    };

    res.json(response);
  };

  deleteFacture = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.factureService.deleteFacture(id);

    logger.info(`Facture deleted: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      message: 'Facture supprimée avec succès'
    };

    res.json(response);
  };

  updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { statut, modePaiement, dateReglement } = req.body;

    const facture = await this.factureService.updatePaymentStatus(id, {
      statut,
      modePaiement,
      dateReglement: dateReglement ? new Date(dateReglement) : undefined
    });

    logger.info(`Facture payment status updated: ${id}`, { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: facture,
      message: 'Statut de paiement mis à jour avec succès'
    };

    res.json(response);
  };
}