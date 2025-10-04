import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import { register } from 'tsconfig-paths';
import { DataSource } from 'typeorm';
import * as path from 'path';

export const resolvePath = (...pathSegments: string[]): string => {
  try {
    // Try __dirname first (works in local development)
    return path.join(__dirname, ...pathSegments);
  } catch {
    // Fallback to process.cwd() for production
    return path.resolve(process.cwd(), 'src', ...pathSegments);
  }
};

// SSL certificate path
const RDS_CA_PATH = resolvePath('..', 'certs', 'rds-ca-bundle.pem');

// Register TypeScript path mappings (needed for @/ imports in entities)
try {
  register({
    baseUrl: resolvePath('..'),
    paths: {
      '@/*': ['./*'],
    },
  });
} catch {
  // Path registration might fail in some environments, continue silently
}

// Load environment variables (only if not in production)
if (process.env.NODE_ENV !== 'production') {
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : '.env.local';
  config({ path: envFile });
}

// Database configuration
const databaseConfig = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  ssl:
    process.env.SSL === 'true'
      ? {
          rejectUnauthorized: true,
          ca: fs.existsSync(RDS_CA_PATH)
            ? fs.readFileSync(RDS_CA_PATH).toString()
            : undefined,
        }
      : false,
  entities: [resolvePath('..', '**', '*.entity{.ts,.js}')],
  migrations: [resolvePath('..', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
};

// DataSource for TypeORM CLI
const AppDataSource = new DataSource(databaseConfig);

// NestJS configuration application
export const DatabaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    ...databaseConfig,
    migrationsRun: process.env.NODE_ENV === 'test',
  }),
);

export default AppDataSource;
