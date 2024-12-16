import { Router, RequestHandler } from 'express';
import { MeetingController } from '../controllers/MeetingController';
import { authMiddleware } from '../middlewares/auth.middleware';

export const createMeetingRouter = (meetingController: MeetingController): Router => {
  const router = Router();

  router.use(authMiddleware);

  // Get meeting statistics
  router.get('/stats', meetingController.getMeetingStats as RequestHandler);

  // Get all meetings
  router.get('/', meetingController.getMeetings as RequestHandler);

  // Get meeting by ID
  router.get('/:id', meetingController.getMeetingById as RequestHandler);

  // Create new meeting
  router.post('/', meetingController.createMeeting as RequestHandler);

  // Update meeting transcript
  router.put('/:id/transcript', meetingController.updateTranscript as RequestHandler);

  // Summarize meeting
  router.post('/:id/summarize', meetingController.summarizeMeeting as RequestHandler);

  return router;
}; 