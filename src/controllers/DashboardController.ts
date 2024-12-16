import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { IDashboardService } from '../interfaces/services/IDashboardService';

export class DashboardController {
  constructor(private readonly dashboardService: IDashboardService) { }

  getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getDashboardStats(req.userId!);
      res.json(stats);
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: (error as Error).message });
    }
  };
} 