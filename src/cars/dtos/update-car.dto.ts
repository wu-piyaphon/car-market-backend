import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCarDto extends PartialType(CreateCarDto) {}
