/**
 * Integration tests for POST /api/auth/login
 */
import { NextRequest } from 'next/server';
import { testPrisma, setup, teardown, createTestUser } from '@/lib/__tests__/integration-setup';

// Mock JWT module to avoid jose ESM issues
jest.mock('@/lib/jwt', () => ({
  signToken: jest.fn().mockResolvedValue('mock-token'),
  verifyToken: jest.fn().mockResolvedValue(null),
  generateRefreshToken: jest.fn().mockResolvedValue('mock-refresh-token'),
  verifyRefreshToken: jest.fn().mockResolvedValue(null),
}));

// Mock password module
jest.mock('@/lib/password', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed-password'),
  verifyPassword: jest.fn().mockImplementation((password: string) => {
    // Return true for 'password123', false for anything else
    return Promise.resolve(password === 'password123');
  }),
}));

// Mock the prisma module to use test database
jest.mock('@/lib/prisma', () => {
  const { testPrisma: mockPrisma } = require('@/lib/__tests__/integration-setup');
  return { prisma: mockPrisma };
});

// Import after mock
import { POST } from '@/app/api/auth/login/route';

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await testPrisma.user.deleteMany();
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('returns 200 and sets cookies with valid credentials', async () => {
    // Create user first - use the same password hash that matches our mock
    // The mock returns true for 'password123', so we need to use that password in the test
    const { hashPassword } = await import('@/lib/password');
    const passwordHash = await hashPassword('password123');
    
    await testPrisma.user.create({
      data: {
        email: 'login@test.com',
        passwordHash,
        name: 'Test User',
      },
    });

    const body = {
      email: 'login@test.com',
      password: 'password123',
    };

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    // Check cookies are set
    const cookies = response.headers.get('set-cookie');
    expect(cookies).toBeTruthy();
    expect(cookies).toContain('token=');
    expect(cookies).toContain('refreshToken=');
  });

  it('returns 401 with invalid email', async () => {
    const body = {
      email: 'nonexistent@test.com',
      password: 'password123',
    };

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    // Security: return password error (not email) to not reveal email existence
    expect(data.errors.password).toBeDefined();
  });

  it('returns 401 with invalid password', async () => {
    // Create user first
    await createTestUser({ email: 'login@test.com', password: 'password123' });

    const body = {
      email: 'login@test.com',
      password: 'wrongpassword',
    };

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.errors.password).toBeDefined();
  });

  it('returns 400 for missing email', async () => {
    const body = {
      password: 'password123',
    };

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('returns 400 for missing password', async () => {
    const body = {
      email: 'test@test.com',
    };

    const request = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
