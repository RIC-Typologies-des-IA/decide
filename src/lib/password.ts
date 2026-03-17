/**
 * Password hashing and verification utilities
 * Uses bcryptjs for cross-platform compatibility
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error('Password is required');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param hash - Hash to verify against
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string, 
  hash: string
): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }

  try {
    return bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
