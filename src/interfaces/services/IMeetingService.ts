import { IMeeting } from '../models/IMeeting';
import { ITask } from '../models/ITask';

export interface IMeetingService {
  createMeeting(data: Omit<IMeeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<IMeeting>;
  getMeetingById(id: string): Promise<IMeeting | null>;
  getMeetingsForUser(userId: string, options?: { skip?: number; limit?: number }): Promise<IMeeting[]>;
  updateTranscript(id: string, transcript: string): Promise<IMeeting | null>;
  summarizeMeeting(id: string): Promise<{ meeting: IMeeting; tasks: ITask[] }>;
  getMeetingStats({ userId }: { userId?: string }): Promise<{
    totalMeetings: number;
    averageParticipants: number;
    topParticipants: Array<{ participant: string; meetingCount: number }>;
    meetingsByDayOfWeek: Array<{ dayOfWeek: number; count: number }>;
  }>;
} 