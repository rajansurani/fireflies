import { IMeeting } from '../models/IMeeting';

export interface DashboardStats {
  meetings: {
    total: number;
    upcoming: IMeeting[];
    recentlyCompleted: IMeeting[];
  };
  tasks: {
    total: number;
    byStatus: {
      pending: number;
      'in-progress': number;
      completed: number;
    };
    pastDue: number;
    upcoming: number;
  };
}

export interface IDashboardService {
  getDashboardStats(userId: string): Promise<DashboardStats>;
} 