import { IMeeting } from '../interfaces/models/IMeeting';
import { ITask } from '../interfaces/models/ITask';
import { IMeetingRepository } from '../interfaces/repositories/IMeetingRepository';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { IMeetingService } from '../interfaces/services/IMeetingService';
import { AIService } from '../utils/AIService';

export class MeetingService implements IMeetingService {
  constructor(
    private readonly meetingRepository: IMeetingRepository,
    private readonly taskRepository: ITaskRepository,
    private readonly aiService: AIService
  ) { }

  async createMeeting(data: Omit<IMeeting, 'id' | 'createdAt' | 'updatedAt'>): Promise<IMeeting> {
    return this.meetingRepository.create(data);
  }

  async getMeetingById(id: string): Promise<IMeeting | null> {
    return this.meetingRepository.findById(id);
  }

  async getMeetingsForUser(userId: string, options?: { skip?: number; limit?: number }): Promise<IMeeting[]> {
    return this.meetingRepository.find({ userId }, options);
  }

  async updateTranscript(id: string, transcript: string): Promise<IMeeting | null> {
    return this.meetingRepository.update(id, { transcript });
  }

  async summarizeMeeting(id: string): Promise<{ meeting: IMeeting; tasks: ITask[] }> {
    const meeting = await this.meetingRepository.findById(id);
    if (!meeting) {
      throw new Error('Meeting not found');
    }

    if (!meeting.transcript) {
      throw new Error('Meeting transcript not found');
    }

    // Get summary and action items from AI service
    const { summary, actionItems } = await this.aiService.analyzeMeeting(meeting.transcript);

    // Update meeting with summary
    const updatedMeeting = await this.meetingRepository.update(id, {
      summary,
      actionItems
    });

    if (!updatedMeeting) {
      throw new Error('Failed to update meeting');
    }

    // Create tasks from action items
    const tasks = await Promise.all(
      actionItems.map(item =>
        this.taskRepository.create({
          meetingId: id,
          userId: meeting.userId,
          title: item,
          description: `Action item from meeting: ${meeting.title}`,
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Due in 1 week
        })
      )
    );

    return { meeting: updatedMeeting, tasks };
  }

  async getMeetingStats({ userId }: { userId: string }) {
    return this.meetingRepository.getMeetingStats({ userId });
  }
} 