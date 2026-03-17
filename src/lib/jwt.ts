/**
 * JWT token management utilities
 * Uses jose library for Edge runtime compatibility (Next.js App Router)
 */

import { SignJWT, jwtVerify } from 'jose';
import type { UserSession, TokenPayload } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'development-secret-change-in-production'
);

// Token expiry times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Sign an access token with user session data
 * @param payload - User session data to encode in token
 * @returns Signed JWT token string
 */
export async function signToken(payload: UserSession): Promise<string> {
  const token = await new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setSubject(payload.userId)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify an access token
 * @param token - JWT token to verify
 * @returns UserSession if valid, null if invalid/expired
 */
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Verify it's an access token
    if (payload.type !== 'access') {
      return null;
    }

    // Extract user session data
    const session: UserSession = {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string | null,
    };

    return session;
  } catch {
    return null;
  }
}

/**
 * Generate a refresh token for session persistence
 * @param userId - User ID to encode in token
 * @returns Signed JWT refresh token string
 */
export async function generateRefreshToken(userId: string): Promise<string> {
  const token = await new SignJWT({ type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setSubject(userId)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a refresh token
 * @param token - JWT refresh token to verify
 * @returns User ID if valid, null if invalid/expired
 */
export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Verify it's a refresh token
    if (payload.type !== 'refresh') {
      return null;
    }

    return payload.sub as string;
  } catch {
    return null;
  }
}
