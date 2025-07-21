import { Module } from '@nestjs/common';
import { CarTransmissionsController } from './car-transmissions.controller';
import { CarTransmissionsService } from './car-transmissions.service';

@Module({
  controllers: [CarTransmissionsController],
  providers: [CarTransmissionsService],
})
export class CarTransmissionsModule {}
