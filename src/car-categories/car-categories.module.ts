import { Module } from '@nestjs/common';
import { CarCategoriesController } from './car-categories.controller';
import { CarCategoriesService } from './car-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCategory } from '@/car-categories/entities/car-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarCategory])],
  controllers: [CarCategoriesController],
  providers: [CarCategoriesService],
})
export class CarCategoriesModule {}
