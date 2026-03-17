/**
 * Password utility tests
 */

import { hashPassword, verifyPassword } from '../password';

describe('password utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const hash = await hashPassword('testPassword123');
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe('testPassword123');
      expect(hash).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      // Hashes should be different due to random salt
      expect(hash1).not.toBe(hash2);
    });

    it('should throw error for empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow('Password is required');
    });

    it('should throw error for short password', async () => {
      await expect(hashPassword('short')).rejects.toThrow('Password must be at least 8 characters');
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword('wrongPassword', hash);
      
      expect(isValid).toBe(false);
    });

    it('should return false for empty password', async () => {
      const hash = await hashPassword('testPassword123');
      
      const isValid = await verifyPassword('', hash);
      
      expect(isValid).toBe(false);
    });

    it('should return false for empty hash', async () => {
      const isValid = await verifyPassword('testPassword', '');
      
      expect(isValid).toBe(false);
    });
  });
});
