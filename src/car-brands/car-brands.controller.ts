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
  findAll(): Promise<CarBrand[]> {
    return this.carBrandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarBrand> {
    return this.carBrandsService.findOne(id);
  }

  @Post()
  create(@Body() carBrand: CarBrand): Promise<CarBrand> {
    return this.carBrandsService.create(carBrand);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() carBrand: CarBrand,
  ): Promise<CarBrand> {
    return this.carBrandsService.update(id, carBrand);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.carBrandsService.remove(id);
  }
}
