/**
 * Test helpers for authentication tests
 */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Get test database URL
const testDatabaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5434/decide_test?schema=public';

/**
 * Create a test Prisma client connected to the test database
 */
export function createTestPrisma(): PrismaClient {
  const pool = new pg.Pool({ connectionString: testDatabaseUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any);
  
  return new PrismaClient({
    adapter,
    log: ['error'],
  });
}

/**
 * Create a test user in the database
 */
export async function createTestUser(
  prisma: PrismaClient,
  overrides?: {
    email?: string;
    password?: string;
    name?: string;
  }
): Promise<{ id: string; email: string; name: string | null }> {
  const { hashPassword } = await import('@/lib/password');
  
  const email = overrides?.email || `test${Date.now()}@example.com`;
  const password = overrides?.password || 'password123';
  const name = overrides?.name || 'Test User';
  
  const passwordHash = await hashPassword(password);
  
  const user = await prisma.user.create({
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
export async function generateTestToken(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const { signToken } = await import('@/lib/jwt');
  
  const token = await signToken({
    userId,
    email,
    name: name || 'Test User',
  });
  
  return token;
}

/**
 * Clear all test data from the database
 */
export async function clearTestData(prisma: PrismaClient): Promise<void> {
  await prisma.user.deleteMany();
}
