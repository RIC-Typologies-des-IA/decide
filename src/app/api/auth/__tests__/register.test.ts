/**
 * Integration tests for POST /api/auth/register
 */
import { NextRequest } from 'next/server';
import { testPrisma, setup, teardown, createTestUser } from '@/lib/__tests__/integration-setup';

// Mock the prisma module to use test database
jest.mock('@/lib/prisma', () => {
  const { testPrisma: mockPrisma } = require('@/lib/__tests__/integration-setup');
  return { prisma: mockPrisma };
});

// Import after mock
import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  it('creates user with valid data', async () => {
    const body = {
      email: 'newuser@test.com',
      password: 'password123',
      name: 'New User',
    };

    // Create request with body
    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.email).toBe('newuser@test.com');
    expect(data.user.name).toBe('New User');
    expect(data.user.passwordHash).toBeUndefined();
  });

  it('returns 409 for duplicate email', async () => {
    // Create user first
    await createTestUser({ email: 'duplicate@test.com', password: 'password123' });

    const body = {
      email: 'duplicate@test.com',
      password: 'password123',
      name: 'Duplicate User',
    };

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.errors.email).toContain('déjà utilisé');
  });

  it('returns 400 for invalid email format', async () => {
    const body = {
      email: 'not-an-email',
      password: 'password123',
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('returns 400 for password too short', async () => {
    const body = {
      email: 'test@test.com',
      password: 'short',
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('returns 400 for missing email', async () => {
    const body = {
      password: 'password123',
      name: 'Test User',
    };

    const request = new NextRequest('http://localhost/api/auth/register', {
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
