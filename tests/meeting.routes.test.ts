import request from 'supertest';
import express from 'express';
import { createMeetingRouter } from '../src/routes/meeting.routes';
import { MeetingController } from '../src/controllers/MeetingController';
import { IMeetingService } from '../src/interfaces/services/IMeetingService';
import { AuthService } from '../src/services/AuthService';

//@ts-ignore
const mockMeetingService: IMeetingService = {
  createMeeting: jest.fn().mockResolvedValue({
    id: '1',
    userId: 'user1',
    title: 'Test Meeting',
    date: new Date(),
    participants: ['Alice', 'Bob'],
  }),
  // Add other methods as needed for your tests
};

const meetingController = new MeetingController(mockMeetingService);
const app = express();
app.use(express.json());
app.use('/api/meetings', createMeetingRouter(meetingController));

describe('POST /api/meetings', () => {
  it('should create a new meeting', async () => {


    const response = await request(app)
      .post('/api/meetings')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMiIsImlhdCI6MTczNDM3MDEzMSwiZXhwIjoxNzM1MTI2MTMxfQ.gSkVBAtDXRJDgv6j8m2gHYK5RDkkvGBNsabOsUPNlLM') // Mock token
      .send({
        title: 'Test Meeting',
        date: new Date(),
        participants: ['Alice', 'Bob'],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Meeting');
    expect(mockMeetingService.createMeeting).toHaveBeenCalledWith({
      title: 'Test Meeting',
      date: expect.any(String),
      participants: ['Alice', 'Bob'],
      userId: 'user2', // Assuming userId is set in the middleware
    });
  });

  it('should return 400 if title is missing', async () => {
    const response = await request(app)
      .post('/api/meetings')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMiIsImlhdCI6MTczNDM3MDEzMSwiZXhwIjoxNzM1MTI2MTMxfQ.gSkVBAtDXRJDgv6j8m2gHYK5RDkkvGBNsabOsUPNlLM')
      .send({
        date: new Date(),
        participants: ['Alice', 'Bob'],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Title is required');
  });

  // Add more tests for other validation cases as needed
});