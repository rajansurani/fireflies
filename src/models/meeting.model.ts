import mongoose, { Schema } from 'mongoose';
import { IMeeting } from '../interfaces/models/IMeeting';

const meetingSchema = new Schema<IMeeting>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    participants: [{ type: String, required: true }],
    transcript: String,
    summary: String,
    actionItems: [String]
  },
  {
    timestamps: true,
    toObject: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound indexes for common queries
meetingSchema.index({ userId: 1, date: -1 });
meetingSchema.index({ participants: 1 });

export const MeetingModel = mongoose.model<IMeeting>('Meeting', meetingSchema); 