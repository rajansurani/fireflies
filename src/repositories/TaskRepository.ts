import { Model } from 'mongoose';
import { ITask } from '../interfaces/models/ITask';
import { ITaskRepository } from '../interfaces/repositories/ITaskRepository';
import { MongoRepository } from './mongodb/MongoRepository';

export class TaskRepository extends MongoRepository<ITask> implements ITaskRepository {
  constructor(model: Model<ITask>) {
    super(model);
  }

  async getTasksByMeetingId(meetingId: string): Promise<ITask[]> {
    const tasks = await this.model.find({ meetingId });
    return tasks.map(task => task.toObject());
  }

  async getUpcomingTasks({ userId, meetingId }: { userId?: string, meetingId?: string }): Promise<ITask[]> {
    let filters: Record<string, any> = {};
    if (userId) {
      filters["userId"] = userId;
    }
    if (meetingId) {
      filters["meetingId"] = meetingId;
    }
    const tasks = await this.model.find({
      ...filters,
      status: { $ne: 'completed' },
      dueDate: { $gt: new Date() }
    });

    return tasks.map(task => task.toObject());
  }

  async getTaskStats(userId: string) {
    const [stats] = await this.model.aggregate([
      { $match: { userId } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          pastDue: [
            {
              $match: {
                dueDate: { $lt: new Date() },
                status: { $ne: 'completed' }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const statusCounts = stats.byStatus.reduce((acc: Record<string, number>, { _id, count }: {
      _id: string, count: number

    }) => {
      acc[_id] = count;
      return acc;
    }, {} as Record<ITask['status'], number>);

    return {
      total: stats.total[0]?.count || 0,
      byStatus: {
        pending: statusCounts.pending || 0,
        'in-progress': statusCounts['in-progress'] || 0,
        completed: statusCounts.completed || 0
      },
      pastDue: stats.pastDue[0]?.count || 0
    };
  }
} 