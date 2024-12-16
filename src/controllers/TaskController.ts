import { Response } from 'express';
import { ITaskService } from '../interfaces/services/ITaskService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { validateTask } from '../utils/validators';

export class TaskController {
  constructor(private readonly taskService: ITaskService) { }

  getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const tasks = await this.taskService.getTasksForUser(req.userId!, { skip, limit });
      const total = await this.taskService.getTasksForUser(req.userId!);

      res.json({
        total: total.length,
        page,
        limit,
        data: tasks
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  getTaskById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      if (task.userId !== req.userId) {
        res.status(403).json({ message: 'Unauthorized access to task' });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const validationError = validateTask(req.body);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const task = await this.taskService.createTask({
        ...req.body,
        userId: req.userId!
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  updateTaskStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.body.status) {
        res.status(400).json({ message: 'Status is required' });
        return;
      }

      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      if (task.userId !== req.userId) {
        res.status(403).json({ message: 'Unauthorized access to task' });
        return;
      }

      const updatedTask = await this.taskService.updateTaskStatus(
        req.params.id,
        req.body.status
      );
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  getTaskStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.taskService.getTaskStats(req.userId!);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
} 