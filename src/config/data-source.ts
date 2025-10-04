import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';
import { register } from 'tsconfig-paths';
import { DataSource } from 'typeorm';
import * as path from 'path';

// SSL certificate path
const RDS_CA_PATH = path.join(__dirname, '..', 'certs', 'rds-ca-bundle.pem');

// Register TypeScript path mappings (needed for @/ imports in entities)
try {
  register({
    baseUrl: path.join(__dirname, '..'),
    paths: {
      '@/*': ['./*'],
    },
  });
} catch {
  // Path registration failed on production, because tsconfig-paths cannot find the tsconfig.json file
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
          rejectUnauthorized: false,
          ca: fs.existsSync(RDS_CA_PATH)
            ? fs.readFileSync(RDS_CA_PATH).toString()
            : undefined,
        }
      : false,
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '..', 'migrations', '*{.ts,.js}')],
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
