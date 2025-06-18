import { Request, Response } from 'express';
import { ParametresService } from './parametres.service';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';

export class ParametresController {
  private parametresService: ParametresService;

  constructor() {
    this.parametresService = new ParametresService();
  }

  getParametres = async (req: Request, res: Response): Promise<void> => {
    const parametres = await this.parametresService.getParametres();

    const response: ApiResponse = {
      success: true,
      data: parametres
    };

    res.json(response);
  };

  updateParametres = async (req: Request, res: Response): Promise<void> => {
    const parametres = await this.parametresService.updateParametres(req.body);

    logger.info('System parameters updated', { userId: req.user?.id });

    const response: ApiResponse = {
      success: true,
      data: parametres,
      message: 'Paramètres mis à jour avec succès'
    };

    res.json(response);
  };
}