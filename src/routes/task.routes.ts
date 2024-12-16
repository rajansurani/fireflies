import { Router, RequestHandler } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const createTaskRouter = (taskController: TaskController): Router => {
  const router = Router();

  router.use(authMiddleware);

  // Get all tasks
  router.get('/', taskController.getTasks as RequestHandler);

  // Get task statistics
  router.get('/stats', taskController.getTaskStats as RequestHandler);

  // Get task by ID
  router.get('/:id', taskController.getTaskById as RequestHandler);

  // Create new task
  router.post('/', taskController.createTask as RequestHandler);

  // Update task status
  router.put('/:id/status', taskController.updateTaskStatus as RequestHandler);


  return router;
}; 