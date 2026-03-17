/**
 * Integration test setup for authentication API tests
 * 
 * Sets up test database, runs migrations, and provides helpers
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Create separate Prisma clients for test
const testDatabaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5434/decide_test?schema=public';
const pool = new pg.Pool({ connectionString: testDatabaseUrl });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);

export const testPrisma = new PrismaClient({
  adapter,
  log: ['error'],
});

/**
 * Reset database - clean all test data
 */
export async function resetDatabase(): Promise<void> {
  // Delete all users (cascade will handle related records)
  await testPrisma.user.deleteMany();
}

/**
 * Setup function to run before tests
 */
export async function setup(): Promise<void> {
  // Reset database to clean state
  await resetDatabase();
}

/**
 * Teardown function to run after tests
 */
export async function teardown(): Promise<void> {
  // Clean up test data
  await resetDatabase();
  // Disconnect Prisma
  await testPrisma.$disconnect();
}

/**
 * Create a test user directly in the database
 */
export async function createTestUser(overrides?: {
  email?: string;
  password?: string;
  name?: string;
}): Promise<{ id: string; email: string; name: string | null }> {
  const { hashPassword } = await import('@/lib/password');
  
  const email = overrides?.email || 'test@example.com';
  const password = overrides?.password || 'password123';
  const name = overrides?.name || 'Test User';
  
  const passwordHash = await hashPassword(password);
  
  const user = await testPrisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  
  return user;
}

/**
 * Generate a valid JWT token for testing
 */
export async function generateTestToken(userId: string, email: string): Promise<string> {
  const { signToken } = await import('@/lib/jwt');
  
  const token = await signToken({
    userId,
    email,
    name: 'Test User',
  });
  
  return token;
}
