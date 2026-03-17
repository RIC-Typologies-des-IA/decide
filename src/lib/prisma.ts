/**
 * Prisma Client singleton for database access
 * Uses Prisma 7 with PostgreSQL adapter
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create connection pool for PostgreSQL
// Note: Using any type to avoid version conflict between @types/pg and adapter's bundled types
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/decide?schema=public';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pool = new (require('pg').Pool)({ connectionString });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
