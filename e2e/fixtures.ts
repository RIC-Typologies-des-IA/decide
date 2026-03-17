import { test as base, Page } from '@playwright/test';

/**
 * Test fixtures for E2E tests
 */

// Extend the test interface
export interface TestUser {
  email: string;
  password: string;
  name: string;
}

// Create a test user factory
export const testUsers = {
  new: (overrides?: Partial<TestUser>): TestUser => ({
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
    ...overrides,
  }),
};

// Helper to register a user via API (faster than UI)
export async function registerUserViaAPI(page: Page, user: TestUser): Promise<void> {
  await page.request.post('http://localhost:3000/api/auth/register', {
    data: {
      email: user.email,
      password: user.password,
      name: user.name,
    },
  });
}

// Helper to login a user via API (faster than UI)
export async function loginUserViaAPI(page: Page, user: TestUser): Promise<void> {
  const response = await page.request.post('http://localhost:3000/api/auth/login', {
    data: {
      email: user.email,
      password: user.password,
    },
  });
  
  // Extract cookies from response and set them on the page context
  const cookies = response.headers()['set-cookie'];
  if (cookies) {
    // Parse and set cookies
    const cookiePairs = cookies.split(',');
    for (const cookie of cookiePairs) {
      const [nameValue] = cookie.split(';');
      const [name, value] = nameValue.split('=');
      if (name && value) {
        await page.context().addCookies([{
          name: name.trim(),
          value: value.trim(),
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'Strict',
        }]);
      }
    }
  }
}

// Helper to logout via API
export async function logoutViaAPI(page: Page): Promise<void> {
  await page.request.post('http://localhost:3000/api/auth/logout');
}

// Helper to create an authenticated page
export async function createAuthenticatedPage(page: Page, user: TestUser): Promise<Page> {
  // Register and login via API
  await registerUserViaAPI(page, user);
  await loginUserViaAPI(page, user);
  return page;
}

// Export custom test with fixtures
export { test, expect } from '@playwright/test';
