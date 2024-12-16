import { ITask } from '../models/ITask';

export interface ITaskService {
  createTask(data: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask>;
  getTaskById(id: string): Promise<ITask | null>;
  getTasksForUser(userId: string, options?: { skip?: number; limit?: number }): Promise<ITask[]>;
  updateTaskStatus(id: string, status: ITask['status']): Promise<ITask | null>;
  getTaskStats(userId: string): Promise<{
    total: number;
    byStatus: Record<ITask['status'], number>;
    pastDue: number;
  }>;
} 