import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const normalizeDatabaseUrl = (rawUrl: string): string => {
  const url = new URL(rawUrl);

  if (url.hostname.includes('pooler.supabase.com')) {
    url.searchParams.set('sslmode', 'require');
    url.searchParams.set('pgbouncer', 'true');
    url.searchParams.set('connection_limit', '1');
  } else if (!url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require');
  }

  return url.toString();
};

const databaseUrl = process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: {
            url: normalizeDatabaseUrl(databaseUrl),
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
