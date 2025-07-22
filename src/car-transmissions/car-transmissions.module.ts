import { Module } from '@nestjs/common';
import { CarTransmissionsController } from './car-transmissions.controller';
import { CarTransmissionsService } from './car-transmissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarTransmission } from '@/car-transmissions/entities/car-transmission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarTransmission])],
  controllers: [CarTransmissionsController],
  providers: [CarTransmissionsService],
})
export class CarTransmissionsModule {}
