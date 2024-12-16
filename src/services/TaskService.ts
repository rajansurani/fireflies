import { ITask } from '../interfaces/models/ITask';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { ITaskService } from '../interfaces/services/ITaskService';

export class TaskService implements ITaskService {
  constructor(private readonly taskRepository: ITaskRepository) { }

  async createTask(data: Omit<ITask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITask> {
    return this.taskRepository.create(data);
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return this.taskRepository.findById(id);
  }

  async getTasksForUser(userId: string, options?: { skip?: number; limit?: number }): Promise<ITask[]> {
    return this.taskRepository.find({ userId }, options);
  }

  async updateTaskStatus(id: string, status: ITask['status']): Promise<ITask | null> {
    return this.taskRepository.update(id, { status });
  }

  async getTaskStats(userId: string) {
    return this.taskRepository.getTaskStats(userId);
  }
} 