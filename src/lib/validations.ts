/**
 * Input validation schemas using Zod
 * Field-level error messages (UX decision from CONTEXT.md)
 */

import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis').min(8, 'Le mot de passe doit faire au moins 8 caractères'),
  name: z.string().min(1, 'Nom requis').min(2, 'Le nom doit faire au moins 2 caractères').optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  newPassword: z.string().min(1, 'Nouveau mot de passe requis').min(8, 'Le mot de passe doit faire au moins 8 caractères'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;
