import { Module } from '@nestjs/common';
import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CarBrandsController } from '@/car-brands/car-brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand]), CommonModule],
  controllers: [CarBrandsController],
  providers: [CarBrandsService],
  exports: [CarBrandsService],
})
export class CarBrandsModule {}
