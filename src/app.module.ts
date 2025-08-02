import { AuthModule } from '@/auth/auth.module';
import { CarBrandsModule } from '@/car-brands/car-brands.module';
import { CarCategoriesModule } from '@/car-categories/car-categories.module';
import { CarTypesModule } from '@/car-types/car-types.module';
import { CarsModule } from '@/cars/cars.module';
import { CommonModule } from '@/common/common.module';
import { EstimateRequestsModule } from '@/estimate-requests/estimate-requests.module';
import { SellingRequestsModule } from '@/selling-requests/selling-requests.module';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig, DatabaseConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('database'));
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CarsModule,
    CarBrandsModule,
    CarCategoriesModule,
    CarTypesModule,
    CarBrandsModule,
    SellingRequestsModule,
    EstimateRequestsModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
