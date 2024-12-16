import { ITask } from '../models/ITask';
import { IRepository } from './IRepository';

export interface ITaskRepository extends IRepository<ITask> {
  getTasksByMeetingId(meetingId: string): Promise<ITask[]>;
  getUpcomingTasks({ userId, meetingId }: { userId?: string, meetingId?: string }): Promise<ITask[]>;
  getTaskStats(userId: string): Promise<{
    total: number;
    byStatus: Record<ITask['status'], number>;
    pastDue: number;
  }>;
} 