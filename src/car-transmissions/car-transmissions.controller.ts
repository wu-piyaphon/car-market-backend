import { CarTransmissionsService } from '@/car-transmissions/car-transmissions.service';
import { CreateCarTransmissionDto } from '@/car-transmissions/dtos/create-car-transmission.dto';
import { UpdateCarTransmissionDto } from '@/car-transmissions/dtos/update-car-transmission.dto';
import { CarTransmission } from '@/car-transmissions/entities/car-transmission.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('car-transmissions')
export class CarTransmissionsController {
  constructor(
    private readonly carTransmissionsService: CarTransmissionsService,
  ) {}

  @Get()
  findAll(): Promise<CarTransmission[]> {
    return this.carTransmissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarTransmission> {
    return this.carTransmissionsService.findOne(id);
  }

  @Post()
  create(
    @Body() createCarTransmissionDto: CreateCarTransmissionDto,
  ): Promise<CarTransmission> {
    return this.carTransmissionsService.create(createCarTransmissionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCarTransmissionDto: UpdateCarTransmissionDto,
  ): Promise<CarTransmission> {
    return this.carTransmissionsService.update(id, updateCarTransmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.carTransmissionsService.remove(id);
  }
}
