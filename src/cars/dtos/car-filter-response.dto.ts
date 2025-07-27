import { toNumber } from '@/common/utils/transform.utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested, IsString } from 'class-validator';

export class FilterOption {
  @IsString()
  @ApiProperty({ description: 'The value of the filter' })
  name: string;

  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiProperty({ description: 'The count of cars that match the filter' })
  count: number;
}

export class CarFilterResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  brands: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  categories: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  types: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  models: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  subModels: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  modelYears: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  transmissions: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  colors: FilterOption[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterOption)
  engineTypes: FilterOption[];
}
