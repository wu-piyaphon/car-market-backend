import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('car-brands')
export class CarBrandsController {
  constructor(private readonly carBrandsService: CarBrandsService) {}

  @Get()
  async findAll(): Promise<CarBrand[]> {
    return this.carBrandsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CarBrand> {
    return this.carBrandsService.findOne(id);
  }

  @Post()
  async create(@Body() carBrand: CarBrand): Promise<CarBrand> {
    return this.carBrandsService.create(carBrand);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() carBrand: CarBrand,
  ): Promise<CarBrand> {
    return this.carBrandsService.update(id, carBrand);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.carBrandsService.remove(id);
  }
}
