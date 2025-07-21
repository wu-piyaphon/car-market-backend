import { Module } from '@nestjs/common';
import { CarTypesController } from './car-types.controller';
import { CarTypesService } from './car-types.service';

@Module({
  controllers: [CarTypesController],
  providers: [CarTypesService],
})
export class CarTypesModule {}
