import mongoose, { Schema } from 'mongoose';
import { ITask } from '../interfaces/models/ITask';

const taskSchema = new Schema<ITask>(
  {
    meetingId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      required: true
    },
    dueDate: { type: Date, required: true, index: true }
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
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ meetingId: 1, status: 1 });

export const TaskModel = mongoose.model<ITask>('Task', taskSchema); 