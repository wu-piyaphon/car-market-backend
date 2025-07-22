import { PartialType } from '@nestjs/swagger';
import { CreateCarCategoryDto } from './create-car-category.dto';

export class UpdateCarCategoryDto extends PartialType(CreateCarCategoryDto) {}
