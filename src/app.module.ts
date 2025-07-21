import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { BrandsModule } from './brands/brands.module';
import { TransmissionsModule } from './transmissions/transmissions.module';
import { CarCategoriesModule } from './car-categories/car-categories.module';
import { CarTypesModule } from './car-types/car-types.module';
import { CarBrandsModule } from './car-brands/car-brands.module';
import { CarTransmissionsModule } from './car-transmissions/car-transmissions.module';
import { CarRequestsModule } from './car-requests/car-requests.module';
import { SellingRequestsModule } from './selling-requests/selling-requests.module';
import { EstimateRequestsModule } from './estimate-requests/estimate-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CarsModule,
    BrandsModule,
    TransmissionsModule,
    CarCategoriesModule,
    CarTypesModule,
    CarBrandsModule,
    CarTransmissionsModule,
    CarRequestsModule,
    SellingRequestsModule,
    EstimateRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
