import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { register } from 'tsconfig-paths';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Register TypeScript path mappings
register({
  baseUrl: path.join(__dirname, '..'),
  paths: {
    '@/*': ['./*'],
  },
});

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : '.env.local';

config({ path: envFile });

// Fallback to .env if specific env file doesn't exist
if (!process.env.DATABASE_URL) {
  config({ path: '.env.local' });
}

const RDS_CA_PATH = path.join(__dirname, '..', 'certs', 'rds-ca-bundle.pem');

// Common database configuration
const databaseConfig = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  ssl:
    process.env.SSL === 'true'
      ? {
          rejectUnauthorized: true,
          ca: fs.readFileSync(RDS_CA_PATH).toString(),
        }
      : false,
  entities: [path.join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '..', '..', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
};

// DataSource for TypeORM CLI
const AppDataSource = new DataSource(databaseConfig);

// NestJS configuration function
export const DatabaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    ...databaseConfig,
    migrationsRun: process.env.NODE_ENV === 'test',
  }),
);

export default AppDataSource;
