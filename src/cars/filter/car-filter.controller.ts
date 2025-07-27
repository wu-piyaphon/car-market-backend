import { Controller, Get, Query } from '@nestjs/common';
import { CarFilterService } from './car-filter.service';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';

@Controller('cars-filter')
export class CarFilterController {
  constructor(private readonly carFilterService: CarFilterService) {}

  @Get()
  getFilters(@Query() query: CarFilterQueryDto) {
    return this.carFilterService.getFilters(query);
  }
}
