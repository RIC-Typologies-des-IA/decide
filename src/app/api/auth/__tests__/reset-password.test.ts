/**
 * Integration tests for POST /api/auth/reset-password
 */
import { NextRequest } from 'next/server';
import { testPrisma, setup, teardown, createTestUser } from '@/lib/__tests__/integration-setup';
import crypto from 'crypto';

// Mock the prisma module to use test database
jest.mock('@/lib/prisma', () => {
  const { testPrisma: mockPrisma } = require('@/lib/__tests__/integration-setup');
  return { prisma: mockPrisma };
});

// Import after mock - we'll test the POST (request) and PATCH (confirm) separately
import { POST as requestReset, PATCH as confirmReset } from '@/app/api/auth/reset-password/route';

describe('POST /api/auth/reset-password (request reset)', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  it('returns 200 even for unknown email (security)', async () => {
    const body = {
      email: 'nonexistent@test.com',
    };

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await requestReset(request);
    const data = await response.json();

    // Security: Always return success to not reveal email existence
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('envoyé');
  });

  it('returns 200 and creates reset token for existing user', async () => {
    // Create user first
    await createTestUser({ email: 'reset@test.com', password: 'password123' });

    const body = {
      email: 'reset@test.com',
    };

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await requestReset(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Check that reset token was created in database
    const user = await testPrisma.user.findUnique({
      where: { email: 'reset@test.com' },
    });

    expect(user?.resetToken).toBeTruthy();
    expect(user?.resetTokenExpiry).toBeTruthy();
  });

  it('returns 400 for missing email', async () => {
    const body = {};

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await requestReset(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

describe('PATCH /api/auth/reset-password (confirm reset)', () => {
  beforeAll(async () => {
    await setup();
  });

  afterAll(async () => {
    await teardown();
  });

  beforeEach(async () => {
    await testPrisma.user.deleteMany();
  });

  it('updates password with valid token', async () => {
    // Create user with reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const user = await createTestUser({ email: 'reset-confirm@test.com', password: 'oldpassword' });
    
    await testPrisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });

    const body = {
      token: resetToken,
      newPassword: 'newpassword123',
    };

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await confirmReset(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 400 for invalid token', async () => {
    const body = {
      token: 'invalid-token',
      newPassword: 'newpassword123',
    };

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await confirmReset(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors.token).toContain('invalide');
  });

  it('returns 400 for expired token', async () => {
    // Create user with expired reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const user = await createTestUser({ email: 'reset-expired@test.com', password: 'oldpassword' });
    
    await testPrisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() - 3600000), // 1 hour ago (expired)
      },
    });

    const body = {
      token: resetToken,
      newPassword: 'newpassword123',
    };

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await confirmReset(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors.token).toContain('expiré');
  });

  it('returns 400 for missing token', async () => {
    const body = {
      newPassword: 'newpassword123',
    };

    const request = new NextRequest('http://localhost/api/auth/reset-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await confirmReset(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
