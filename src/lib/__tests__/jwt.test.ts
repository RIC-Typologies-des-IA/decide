/**
 * JWT utility tests
 */

import { SignJWT, jwtVerify } from 'jose';
import { 
  signToken, 
  verifyToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../jwt';
import type { UserSession } from '@/types/auth';

// Mock jose library
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setSubject: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJpYXQiOjE3MDk0NDQ0NDQsImV4cCI6MTcwOTQ0ODM0NH0.mock-signature'),
  })),
  jwtVerify: jest.fn(),
}));

describe('JWT utilities', () => {
  const testSession: UserSession = {
    userId: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signToken', () => {
    it('should sign a token with user session data', async () => {
      const token = await signToken(testSession);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(SignJWT).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return session', async () => {
      // Mock a valid token verification
      (jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: {
          userId: testSession.userId,
          email: testSession.email,
          name: testSession.name,
          type: 'access',
        },
      });

      const result = await verifyToken('valid-token');
      
      expect(result).not.toBeNull();
      expect(result?.userId).toBe(testSession.userId);
      expect(result?.email).toBe(testSession.email);
      expect(result?.name).toBe(testSession.name);
    });

    it('should return null for invalid token', async () => {
      // Mock an invalid token verification
      (jwtVerify as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

      const result = await verifyToken('invalid.token.here');
      
      expect(result).toBeNull();
    });

    it('should return null for wrong token type', async () => {
      // Mock a refresh token being used as access token
      (jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: {
          userId: testSession.userId,
          type: 'refresh', // wrong type
        },
      });

      const result = await verifyToken('refresh-token-used-as-access');
      
      expect(result).toBeNull();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', async () => {
      const token = await generateRefreshToken(testSession.userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(SignJWT).toHaveBeenCalled();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token and return userId', async () => {
      (jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: {
          sub: testSession.userId,
          type: 'refresh',
        },
      });

      const result = await verifyRefreshToken('valid-refresh-token');
      
      expect(result).toBe(testSession.userId);
    });

    it('should return null for invalid refresh token', async () => {
      (jwtVerify as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));

      const result = await verifyRefreshToken('invalid.token.here');
      
      expect(result).toBeNull();
    });

    it('should return null when verifying access token as refresh', async () => {
      (jwtVerify as jest.Mock).mockResolvedValueOnce({
        payload: {
          sub: testSession.userId,
          type: 'access', // wrong type
        },
      });

      const result = await verifyRefreshToken('access-token-used-as-refresh');
      
      expect(result).toBeNull();
    });
  });
});
