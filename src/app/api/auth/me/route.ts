/**
 * Current user endpoint
 * GET /api/auth/me
 * Returns current user session from JWT token
 * Handles token refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signToken, verifyRefreshToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Try to verify access token first
    if (token) {
      const session = await verifyToken(token);
      
      if (session) {
        // Token is valid, return user session
        return NextResponse.json(
          { 
            success: true, 
            user: {
              id: session.userId,
              email: session.email,
              name: session.name,
            }
          },
          { status: 200 }
        );
      }
    }

    // Access token invalid or missing - try refresh token
    if (refreshToken) {
      const userId = await verifyRefreshToken(refreshToken);
      
      if (userId) {
        // Refresh token is valid - get user and generate new access token
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
          },
        });

        if (user) {
          const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
          };

          const newAccessToken = await signToken(session);
          
          const response = NextResponse.json(
            { 
              success: true, 
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
              }
            },
            { status: 200 }
          );

          // Set new access token
          response.cookies.set('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes
            path: '/',
          });

          return response;
        }
      }
    }

    // No valid tokens
    return NextResponse.json(
      { 
        success: false, 
        error: 'Non autorisé' 
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur' 
      },
      { status: 500 }
    );
  }
}
