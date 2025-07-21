import { Module } from '@nestjs/common';
import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CarBrandsController } from '@/car-brands/car-brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand])],
  controllers: [CarBrandsController],
  providers: [CarBrandsService],
})
export class CarBrandsModule {}
