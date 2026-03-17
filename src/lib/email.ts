/**
 * Email service utilities
 * Uses Resend for sending transactional emails
 */

import { Resend } from 'resend';

// Initialize Resend client (will be null in dev mode without API key)
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'test'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@decide.app';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Send a password reset email
 * @param email - Recipient email address
 * @param resetToken - Password reset token to include in the email
 * @returns True if email was sent successfully, false otherwise
 */
export async function sendPasswordResetEmail(
  email: string, 
  resetToken: string
): Promise<boolean> {
  const resetLink = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset your password</h1>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">
          <p>— The Decide team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Reset your password

You requested to reset your password. Click the link below to create a new password:

${resetLink}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

— The Decide team
  `;

  // In development mode without real API key, log to console
  if (!resend) {
    console.log('=== DEV MODE: Password Reset Email ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Reset your password`);
    console.log(`Link: ${resetLink}`);
    console.log('=======================================');
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your password',
      text: emailText,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send password reset email:', err);
    return false;
  }
}

/**
 * Send a welcome email to new users
 * @param email - Recipient email address
 * @param name - User's name
 * @returns True if email was sent successfully, false otherwise
 */
export async function sendWelcomeEmail(
  email: string, 
  name: string
): Promise<boolean> {
  const loginLink = `${APP_URL}/auth/login`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Decide, ${name}!</h1>
        <p>We're excited to have you on board. Decide helps teams make better decisions together.</p>
        <a href="${loginLink}" class="button">Get Started</a>
        <div class="footer">
          <p>— The Decide team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Welcome to Decide, ${name}!

We're excited to have you on board. Decide helps teams make better decisions together.

Get started: ${loginLink}

— The Decide team
  `;

  // In development mode without real API key, log to console
  if (!resend) {
    console.log('=== DEV MODE: Welcome Email ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to Decide!`);
    console.log('===============================');
    return true;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Decide!',
      text: emailText,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send welcome email:', err);
    return false;
  }
}
