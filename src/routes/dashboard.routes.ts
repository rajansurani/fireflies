import { Router, RequestHandler } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const createDashboardRouter = (dashboardController: DashboardController): Router => {
  const router = Router();

  router.use(authMiddleware);

  // Get dashboard statistics
  router.get('/', dashboardController.getDashboardStats as RequestHandler);

  return router;
}; 