import { CarTypesService } from '@/car-types/car-types.service';
import { CreateCarTypeDto } from '@/car-types/dtos/create-car-type.dto';
import { UpdateCarTypeDto } from '@/car-types/dtos/update-car-type.dto';
import { CarType } from '@/car-types/entities/car-type.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('car-types')
export class CarTypesController {
  constructor(private readonly carTypesService: CarTypesService) {}

  @Get()
  findAll(): Promise<CarType[]> {
    return this.carTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarType> {
    return this.carTypesService.findOne(id);
  }

  @Post()
  create(@Body() createCarTypeDto: CreateCarTypeDto): Promise<CarType> {
    return this.carTypesService.create(createCarTypeDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarTypeDto: UpdateCarTypeDto,
  ): Promise<CarType> {
    return this.carTypesService.update(id, updateCarTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.carTypesService.remove(id);
  }
}
