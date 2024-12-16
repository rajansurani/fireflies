export interface ITask {
  id?: string;
  meetingId: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 