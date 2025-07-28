import { Module } from '@nestjs/common';
import { CarTypesController } from './car-types.controller';
import { CarTypesService } from './car-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarType } from '@/car-types/entities/car-type.entity';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarType]), CommonModule],
  controllers: [CarTypesController],
  providers: [CarTypesService],
})
export class CarTypesModule {}
