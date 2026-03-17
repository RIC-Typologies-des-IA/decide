/**
 * User login endpoint
 * POST /api/auth/login
 * Sets httpOnly cookies for JWT tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { signToken, generateRefreshToken } from '@/lib/jwt';
import { loginSchema, type LoginInput } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: LoginInput = await request.json();
    
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Field-level error messages
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

    const { email, password } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          errors: { password: 'Email ou mot de passe incorrect' } 
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { 
          success: false, 
          errors: { password: 'Email ou mot de passe incorrect' } 
        },
        { status: 401 }
      );
    }

    // Generate tokens
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = await signToken(session);
    const refreshToken = await generateRefreshToken(user.id);

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 200 }
    );

    // Set cookies with security flags
    // Access token: 15 minutes
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes in seconds
      path: '/',
    });

    // Refresh token: 7 days
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: { general: 'Erreur serveur. Veuillez réessayer.' } 
      },
      { status: 500 }
    );
  }
}
