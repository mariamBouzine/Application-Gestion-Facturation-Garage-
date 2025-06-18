import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { ApiResponse } from '@/types';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getMetrics = async (req: Request, res: Response): Promise<void> => {
    const metrics = await this.dashboardService.getMetrics();

    const response: ApiResponse = {
      success: true,
      data: metrics
    };

    res.json(response);
  };

  getAlerts = async (req: Request, res: Response): Promise<void> => {
    const alerts = await this.dashboardService.getAlerts();

    const response: ApiResponse = {
      success: true,
      data: alerts
    };

    res.json(response);
  };

  getRecentActivity = async (req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.query.limit as string) || 10;
    const activity = await this.dashboardService.getRecentActivity(limit);

    const response: ApiResponse = {
      success: true,
      data: activity
    };

    res.json(response);
  };
}