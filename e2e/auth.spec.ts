/**
 * E2E tests for authentication flows
 */
import { test, expect } from './fixtures';
import { testUsers, registerUserViaAPI, loginUserViaAPI, logoutViaAPI } from './fixtures';

test.describe('Authentication Flows', () => {
  
  test.describe('Registration', () => {
    test('user can complete registration wizard', async ({ page }) => {
      const user = testUsers.new();
      
      // Navigate to registration page
      await page.goto('/auth/register');
      
      // Step 1: Email
      await page.fill('[name="email"]', user.email);
      await page.click('button:has-text("Continuer")');
      
      // Step 2: Password
      await page.fill('[name="password"]', user.password);
      await page.fill('[name="confirmPassword"]', user.password);
      await page.click('button:has-text("Continuer")');
      
      // Step 3: Profile
      await page.fill('[name="name"]', user.name);
      await page.click('button:has-text("Créer mon compte")');
      
      // Should be redirected to dashboard
      await expect(page).toHaveURL('/dashboard');
      
      // Should see user info on dashboard
      await expect(page.locator('text=' + user.email)).toBeVisible();
    });

    test('registration shows error for duplicate email', async ({ page }) => {
      const user = testUsers.new();
      
      // Register first time
      await registerUserViaAPI(page, user);
      
      // Navigate to registration page again
      await page.goto('/auth/register');
      
      // Try to register with same email
      await page.fill('[name="email"]', user.email);
      await page.click('button:has-text("Continuer")');
      
      // Should show error
      await expect(page.locator('text=déjà utilisé')).toBeVisible();
    });

    test('registration validates email format', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Enter invalid email
      await page.fill('[name="email"]', 'not-an-email');
      await page.click('button:has-text("Continuer")');
      
      // Should show validation error
      await expect(page.locator('text=email')).toBeVisible();
    });

    test('registration validates password length', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Enter valid email first
      await page.fill('[name="email"]', 'test@test.com');
      await page.click('button:has-text("Continuer")');
      
      // Enter short password
      await page.fill('[name="password"]', 'short');
      await page.click('button:has-text("Continuer")');
      
      // Should show validation error
      await expect(page.locator('text=8 caractères')).toBeVisible();
    });
  });

  test.describe('Login', () => {
    test('user can login with correct credentials', async ({ page }) => {
      const user = testUsers.new();
      
      // Register user first
      await registerUserViaAPI(page, user);
      
      // Navigate to login page
      await page.goto('/auth/login');
      
      // Fill in credentials
      await page.fill('[name="email"]', user.email);
      await page.fill('[name="password"]', user.password);
      await page.click('button:has-text("Se connecter")');
      
      // Should be redirected to dashboard
      await expect(page).toHaveURL('/dashboard');
    });

    test('login shows error with wrong password', async ({ page }) => {
      const user = testUsers.new();
      
      // Register user first
      await registerUserViaAPI(page, user);
      
      // Navigate to login page
      await page.goto('/auth/login');
      
      // Enter wrong password
      await page.fill('[name="email"]', user.email);
      await page.fill('[name="password"]', 'wrongpassword');
      await page.click('button:has-text("Se connecter")');
      
      // Should show error
      await expect(page.locator('text=incorrect')).toBeVisible();
    });

    test('login shows error for non-existent user', async ({ page }) => {
      await page.goto('/auth/login');
      
      await page.fill('[name="email"]', 'nonexistent@test.com');
      await page.fill('[name="password"]', 'password123');
      await page.click('button:has-text("Se connecter")');
      
      // Should show error
      await expect(page.locator('text=incorrect')).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('user can logout and is redirected to login', async ({ page }) => {
      const user = testUsers.new();
      
      // Login user
      await registerUserViaAPI(page, user);
      await loginUserViaAPI(page, user);
      
      // Navigate to dashboard
      await page.goto('/dashboard');
      
      // Click logout button
      await page.click('text=Se déconnecter');
      
      // Should be redirected to login page
      await expect(page).toHaveURL('/auth/login');
    });

    test('user cannot access dashboard after logout', async ({ page }) => {
      const user = testUsers.new();
      
      // Login user
      await registerUserViaAPI(page, user);
      await loginUserViaAPI(page, user);
      
      // Logout
      await logoutViaAPI(page);
      
      // Try to access dashboard - should be redirected
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/auth/login');
    });
  });

  test.describe('Protected Routes', () => {
    test('dashboard redirects to login when not authenticated', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/auth/login');
    });

    test('authenticated user can access dashboard', async ({ page }) => {
      const user = testUsers.new();
      
      // Login user
      await registerUserViaAPI(page, user);
      await loginUserViaAPI(page, user);
      
      // Access dashboard
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe('Password Reset', () => {
    test('user can request password reset', async ({ page }) => {
      const user = testUsers.new();
      
      // Register user first
      await registerUserViaAPI(page, user);
      
      // Navigate to password reset page
      await page.goto('/auth/reset-password');
      
      // Request reset
      await page.fill('[name="email"]', user.email);
      await page.click('button:has-text("Envoyer le lien")');
      
      // Should see success message
      await expect(page.locator('text=envoyé')).toBeVisible();
    });

    test('password reset shows success even for unknown email', async ({ page }) => {
      await page.goto('/auth/reset-password');
      
      await page.fill('[name="email"]', 'nonexistent@test.com');
      await page.click('button:has-text("Envoyer le lien")');
      
      // Should see success message (security: don't reveal email existence)
      await expect(page.locator('text=envoyé')).toBeVisible();
    });
  });
});
