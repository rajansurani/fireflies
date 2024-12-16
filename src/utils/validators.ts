import { IMeeting } from '../interfaces/models/IMeeting';
import { ITask } from '../interfaces/models/ITask';

export const validateMeeting = (data: Partial<IMeeting>): string | null => {
  if (!data.title?.trim()) {
    return 'Title is required';
  }

  if (!data.date) {
    return 'Date is required';
  }
  if (isNaN(new Date(data.date).getTime())) {
    return 'Invalid date format';
  }

  if (!Array.isArray(data.participants) || data.participants.length === 0) {
    return 'At least one participant is required';
  }

  if (data.participants.some(p => typeof p !== 'string' || !p.trim())) {
    return 'Invalid participant format';
  }

  return null;
};

export const validateTask = (data: Partial<ITask>): string | null => {
  if (!data.title?.trim()) {
    return 'Title is required';
  }

  if (!data.description?.trim()) {
    return 'Description is required';
  }

  if (!data.meetingId?.trim()) {
    return 'Meeting ID is required';
  }

  if (!data.dueDate) {
    return 'Due date is required';
  }

  if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
    return 'Invalid status';
  }

  return null;
}; 