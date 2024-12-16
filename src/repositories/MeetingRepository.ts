import { Model } from 'mongoose';
import { IMeeting } from '../interfaces/models/IMeeting';
import { IMeetingRepository } from '../interfaces/repositories/IMeetingRepository';
import { MongoRepository } from './mongodb/MongoRepository';

export class MeetingRepository extends MongoRepository<IMeeting> implements IMeetingRepository {
  constructor(model: Model<IMeeting>) {
    super(model);
  }

  async getUpcomingMeetings({ userId }: { userId: string }) {
    const meetings = await this.model.aggregate([{
      $match: {
        userId,
        date: {
          $gt: new Date()
        }
      }
    }, {
      $sort: {
        date: -1,
      }
    },])
    return meetings;
  }

  async getRecentMeetings({ userId, limit = 5 }: { userId: string, limit?: number }) {
    const meetings = await this.model.aggregate([{
      $match: {
        userId,
        date: {
          $lt: new Date()
        }
      },

    }, {
      $sort: {
        date: -1,
      }
    },
    { $limit: limit }])
    return meetings;
  }

  async getMeetingStats({ userId }: { userId: string }) {
    const [stats] = await this.model.aggregate([{ $match: { userId } },
    {
      $facet: {
        totalMeetings: [{ $count: 'count' }],
        participantStats: [
          { $unwind: '$participants' },
          {
            $group: {
              _id: '$participants',
              meetingCount: { $sum: 1 }
            }
          },
          { $sort: { meetingCount: -1 } },
          { $limit: 5 }
        ],
        dayOfWeekStats: [
          {
            $group: {
              _id: { $dayOfWeek: '$date' },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ],
        totalParticipants: [
          { $unwind: '$participants' },
          { $group: { _id: null, total: { $sum: 1 } } }
        ]
      }
    }
    ]);



    const totalMeetings = stats.totalMeetings[0]?.count || 0;
    const totalParticipants = stats.totalParticipants[0]?.total || 0;

    return {
      totalMeetings,
      averageParticipants: totalMeetings ? totalParticipants / totalMeetings : 0,
      topParticipants: stats.participantStats.map(({ _id, meetingCount }: {
        _id: string;
        meetingCount: number;
      }) => ({
        participant: _id,
        meetingCount
      })),
      meetingsByDayOfWeek: stats.dayOfWeekStats.map(({ _id, count }: {
        _id: string;
        count: number;
      }) => ({
        dayOfWeek: _id,
        count
      }))
    };
  }
} 