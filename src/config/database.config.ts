import * as fs from 'fs';
import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// ----------------------------------------------------------------------

const RDS_CA_PATH = path.join(__dirname, '..', 'certs', 'rds-ca-bundle.pem');

// ----------------------------------------------------------------------

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl:
      process.env.SSL === 'true'
        ? {
            rejectUnauthorized: true,
            ca: fs.readFileSync(RDS_CA_PATH).toString(),
          }
        : false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    migrationsRun: process.env.NODE_ENV === 'test',
    migrationsTableName: 'migrations',
    synchronize: false,
  }),
);
