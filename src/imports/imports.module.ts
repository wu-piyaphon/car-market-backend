import { CarBrandsModule } from '@/car-brands/car-brands.module';
import { CarTypesModule } from '@/car-types/car-types.module';
import { CarsModule } from '@/cars/cars.module';
import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { ImportsService } from './imports.service';

@Module({
  imports: [CarsModule, CarBrandsModule, CarTypesModule],
  controllers: [ImportsController],
  providers: [ImportsService],
  exports: [ImportsService],
})
export class ImportsModule {}
