// Jest setup file
// This file runs before each test

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-for-testing';
process.env.RESEND_API_KEY = 'test';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.FROM_EMAIL = 'test@decide.app';

// Reset modules between tests to avoid mock leakage
beforeEach(() => {
  jest.resetModules();
});

// Suppress console logs during tests unless explicitly needed
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
