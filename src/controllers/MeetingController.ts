import { Request, Response } from 'express';
import { IMeetingService } from '../interfaces/services/IMeetingService';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { validateMeeting } from '../utils/validators';

export class MeetingController {
  constructor(private readonly meetingService: IMeetingService) { }

  getMeetings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const meetings = await this.meetingService.getMeetingsForUser(req.userId!, { skip, limit });
      const total = await this.meetingService.getMeetingsForUser(req.userId!);

      res.json({
        total: total.length,
        page,
        limit,
        data: meetings
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  getMeetingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const meeting = await this.meetingService.getMeetingById(req.params.id);
      if (!meeting) {
        res.status(404).json({ message: 'Meeting not found' });
        return;
      }
      if (meeting.userId !== req.userId) {
        res.status(403).json({ message: 'Unauthorized access to meeting' });
        return;
      }
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  createMeeting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const validationError = validateMeeting(req.body);
      if (validationError) {
        res.status(400).json({ message: validationError });
        return;
      }

      const meeting = await this.meetingService.createMeeting({
        ...req.body,
        userId: req.userId!
      });
      res.status(201).json(meeting);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  updateTranscript = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.body.transcript) {
        res.status(400).json({ message: 'Transcript is required' });
        return;
      }

      const meeting = await this.meetingService.getMeetingById(req.params.id);
      if (!meeting) {
        res.status(404).json({ message: 'Meeting not found' });
        return;
      }
      if (meeting.userId !== req.userId) {
        res.status(403).json({ message: 'Unauthorized access to meeting' });
        return;
      }

      const updatedMeeting = await this.meetingService.updateTranscript(
        req.params.id,
        req.body.transcript
      );
      res.json(updatedMeeting);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  summarizeMeeting = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const meeting = await this.meetingService.getMeetingById(req.params.id);
      if (!meeting) {
        res.status(404).json({ message: 'Meeting not found' });
        return;
      }
      if (meeting.userId !== req.userId) {
        res.status(403).json({ message: 'Unauthorized access to meeting' });
        return;
      }

      const result = await this.meetingService.summarizeMeeting(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  getMeetingStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.meetingService.getMeetingStats({ userId: req.userId });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
} 