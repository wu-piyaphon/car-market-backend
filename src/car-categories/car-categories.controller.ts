import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CarCategoriesService } from '@/car-categories/car-categories.service';
import { CreateCarCategoryDto } from '@/car-categories/dtos/create-car-category.dto';
import { UpdateCarCategoryDto } from '@/car-categories/dtos/update-car-category.dto';
import { CarCategory } from '@/car-categories/entities/car-category.entity';

@Controller('car-categories')
export class CarCategoriesController {
  constructor(private readonly carCategoriesService: CarCategoriesService) {}

  @Get()
  findAll(): Promise<CarCategory[]> {
    return this.carCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarCategory> {
    return this.carCategoriesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCarCategoryDto: CreateCarCategoryDto,
  ): Promise<CarCategory> {
    return this.carCategoriesService.create(createCarCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCarCategoryDto: UpdateCarCategoryDto,
  ): Promise<CarCategory> {
    return this.carCategoriesService.update(id, updateCarCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.carCategoriesService.remove(id);
  }
}
