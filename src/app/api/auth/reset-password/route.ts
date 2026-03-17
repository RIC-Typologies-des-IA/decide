/**
 * Password reset endpoints
 * POST /api/auth/reset-password - Request password reset
 * PATCH /api/auth/reset-password - Confirm password reset
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { sendPasswordResetEmail } from '@/lib/email';
import { resetPasswordRequestSchema, resetPasswordConfirmSchema, type ResetPasswordRequestInput, type ResetPasswordConfirmInput } from '@/lib/validations';
import { randomUUID } from 'crypto';

// Request password reset
export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordRequestInput = await request.json();
    
    const validationResult = resetPasswordRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        const field = err.path[0];
        if (field && typeof field === 'string') {
          errors[field] = err.message;
        }
      }
      
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success for security (don't reveal if email exists)
    // If user exists, generate reset token and send email
    if (user) {
      const resetToken = randomUUID();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Send email (logs in dev mode)
      await sendPasswordResetEmail(email, resetToken);
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: { general: 'Erreur serveur. Veuillez réessayer.' } 
      },
      { status: 500 }
    );
  }
}

// Confirm password reset
export async function PATCH(request: NextRequest) {
  try {
    const body: ResetPasswordConfirmInput = await request.json();
    
    const validationResult = resetPasswordConfirmSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      for (const err of validationResult.error.issues) {
        const field = err.path[0];
        if (field && typeof field === 'string') {
          errors[field] = err.message;
        }
      }
      
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const { token, newPassword } = validationResult.data;

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          errors: { token: 'Token invalide ou expiré' } 
        },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mot de passe réinitialisé avec succès' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset confirm error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: { general: 'Erreur serveur. Veuillez réessayer.' } 
      },
      { status: 500 }
    );
  }
}
