import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.SSL === 'true',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*.{ts,js}'],
    migrationsRun: process.env.NODE_ENV === 'test',
    migrationsTableName: 'migrations',
    synchronize: process.env.NODE_ENV === 'local',
  }),
);
