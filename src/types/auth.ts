/**
 * Authentication type definitions
 */

export interface UserSession {
  userId: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  session?: UserSession;
}

export interface TokenPayload {
  userId: string;
  email: string;
  name: string | null;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}
