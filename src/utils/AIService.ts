export class AIService {
  async analyzeMeeting(transcript: string): Promise<{
    summary: string;
    actionItems: string[];
  }> {
    // This is a mock implementation
    // In a real application, this would call an AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        const words = transcript.split(' ').length;
        resolve({
          summary: `This is a mock summary of a meeting with ${words} words.`,
          actionItems: [
            'Mock action item 1',
            'Mock action item 2',
            'Mock action item 3'
          ]
        });
      }, 1000);
    });
  }
} 