import { Router } from 'express';
import { DashboardController } from './dashboard.controller';

const router = Router();
const dashboardController = new DashboardController();

// GET /api/dashboard/metrics - Get dashboard metrics
router.get('/metrics', dashboardController.getMetrics);

// GET /api/dashboard/alerts - Get alerts
router.get('/alerts', dashboardController.getAlerts);

// GET /api/dashboard/activity - Get recent activity
router.get('/activity', dashboardController.getRecentActivity);

export default router;