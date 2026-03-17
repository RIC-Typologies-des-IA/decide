/**
 * Integration tests for POST /api/auth/logout
 */
import { testPrisma, setup, teardown } from '@/lib/__tests__/integration-setup';

// Mock the prisma module to use test database
jest.mock('@/lib/prisma', () => {
  const { testPrisma: mockPrisma } = require('@/lib/__tests__/integration-setup');
  return { prisma: mockPrisma };
});

// Import after mock
import { POST } from '@/app/api/auth/logout/route';

describe('POST /api/auth/logout', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  it('clears cookies and returns success', async () => {
    const response = await POST();

    expect(response.status).toBe(200);

    // Check cookies are cleared
    const cookies = response.headers.get('set-cookie');
    expect(cookies).toBeTruthy();
    
    // Both token and refreshToken should be cleared (maxAge=0)
    expect(cookies).toContain('token=');
    expect(cookies).toContain('refreshToken=');
    
    // Check for maxAge=0 (clears the cookie)
    expect(cookies).toContain('Max-Age=0');
  });

  it('always succeeds regardless of authentication state', async () => {
    // Logout without any cookies should still succeed
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
