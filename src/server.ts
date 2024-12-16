import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MeetingModel } from './models/meeting.model';
import { TaskModel } from './models/task.model';
import { MeetingRepository } from './repositories/MeetingRepository';
import { TaskRepository } from './repositories/TaskRepository';
import { MeetingService } from './services/MeetingService';
import { TaskService } from './services/TaskService';
import { DashboardService } from './services/DashboardService';
import { AuthService } from './services/AuthService';
import { MeetingController } from './controllers/MeetingController';
import { TaskController } from './controllers/TaskController';
import { DashboardController } from './controllers/DashboardController';
import { createMeetingRouter } from './routes/meeting.routes';
import { createTaskRouter } from './routes/task.routes';
import { createDashboardRouter } from './routes/dashboard.routes';
import { AIService } from './utils/AIService';
import { errorHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Initialize repositories
const meetingRepository = new MeetingRepository(MeetingModel);
const taskRepository = new TaskRepository(TaskModel);

// Initialize services
const aiService = new AIService();
const authService = new AuthService();
const meetingService = new MeetingService(meetingRepository, taskRepository, aiService);
const taskService = new TaskService(taskRepository);
const dashboardService = new DashboardService(meetingRepository, taskRepository);

// Initialize controllers
const meetingController = new MeetingController(meetingService);
const taskController = new TaskController(taskService);
const dashboardController = new DashboardController(dashboardService);

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to the MeetingBot API' });
});

// Protected routes
app.use('/api/meetings', createMeetingRouter(meetingController));
app.use('/api/tasks', createTaskRouter(taskController));
app.use('/api/dashboard', createDashboardRouter(dashboardController));

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
