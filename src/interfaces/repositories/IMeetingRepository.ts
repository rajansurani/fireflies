import { IMeeting } from '../models/IMeeting';
import { IRepository } from './IRepository';

export interface IMeetingRepository extends IRepository<IMeeting> {
  getUpcomingMeetings({ userId }: { userId: string }): Promise<IMeeting[]>;
  getRecentMeetings({ userId }: { userId: string }): Promise<IMeeting[]>;
  getMeetingStats({ userId }: { userId: string }): Promise<{
    totalMeetings: number;
    averageParticipants: number;
    topParticipants: Array<{ participant: string; meetingCount: number }>;
    meetingsByDayOfWeek: Array<{ dayOfWeek: number; count: number }>;
  }>;
} 