/**
 * Email utility tests
 */

import { sendPasswordResetEmail, sendWelcomeEmail } from '../email';

// Mock the Resend module
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null }),
    },
  })),
}));

describe('email utilities', () => {
  describe('sendPasswordResetEmail', () => {
    it('should log email in dev mode without API key', async () => {
      // Clear module to pick up new env
      jest.resetModules();
      
      const result = await sendPasswordResetEmail('test@example.com', 'reset-token-123');
      
      expect(result).toBe(true);
    });

    it('should return true for valid email', async () => {
      const result = await sendPasswordResetEmail('test@example.com', 'reset-token');
      
      expect(result).toBe(true);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should return true for welcome email', async () => {
      const result = await sendWelcomeEmail('test@example.com', 'John');
      
      expect(result).toBe(true);
    });
  });
});
