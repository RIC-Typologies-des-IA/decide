/**
 * User registration endpoint
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { registerSchema, type RegisterInput } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body: RegisterInput = await request.json();
    
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Field-level error messages (UX decision)
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

    const { email, password, name } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          errors: { email: 'Cet email est déjà utilisé' } 
        },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Compte créé avec succès',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: { general: 'Erreur serveur. Veuillez réessayer.' } 
      },
      { status: 500 }
    );
  }
}
