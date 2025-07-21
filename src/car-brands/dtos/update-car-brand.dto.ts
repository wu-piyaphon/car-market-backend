import { CreateCarBrandDto } from '@/car-brands/dtos/create-car-brand.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCarBrandDto extends PartialType(CreateCarBrandDto) {}
