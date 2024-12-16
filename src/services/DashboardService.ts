import { IMeetingRepository } from '../interfaces/repositories/IMeetingRepository';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { DashboardStats, IDashboardService } from '../interfaces/services/IDashboardService';

export class DashboardService implements IDashboardService {
  constructor(
    private readonly meetingRepository: IMeetingRepository,
    private readonly taskRepository: ITaskRepository
  ) { }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Get meetings data
    const upcomingMeetings = await this.meetingRepository.getUpcomingMeetings({ userId });
    const recentlyCompleted = await this.meetingRepository.getRecentMeetings({ userId });
    const totalMeetingsCounts = await this.meetingRepository.count({ userId });

    // Get tasks data
    const taskStats = await this.taskRepository.getTaskStats(userId);
    const upcomingTasks = await this.taskRepository.getUpcomingTasks({
      userId,
    });

    return {
      meetings: {
        total: totalMeetingsCounts,
        upcoming: upcomingMeetings,
        recentlyCompleted
      },
      tasks: {
        total: taskStats.total,
        byStatus: taskStats.byStatus,
        pastDue: taskStats.pastDue,
        upcoming: upcomingTasks.length
      }
    };
  }
} 