import { SalesRequestType } from '@/common/enums/request.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { toBoolean, toInteger, toNumber } from '@/common/utils/transform.utils';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CarListQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car type name' })
  type?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car brand name' })
  brand?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car category name' })
  category?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car model' })
  model?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car sub model' })
  subModel?: string;

  @IsOptional()
  @IsEnum(Transmission)
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car transmission', enum: Transmission })
  transmission?: Transmission;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car color' })
  color?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ description: 'Car model year' })
  modelYear?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Car engine type' })
  engineType?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ description: 'Car engine capacity' })
  engineCapacity?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => toInteger(value))
  @Min(0)
  @ApiPropertyOptional({ description: 'Car minimum mileage' })
  minMileage?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => toInteger(value))
  @Min(0)
  @ApiPropertyOptional({ description: 'Car maximum mileage' })
  maxMileage?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @Min(0)
  @ApiPropertyOptional({ description: 'Car minimum price' })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @Min(0)
  @ApiPropertyOptional({ description: 'Car maximum price' })
  maxPrice?: number;

  @IsOptional()
  @IsEnum(SalesRequestType)
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({
    enum: SalesRequestType,
    description: 'Car sales type',
  })
  salesType?: SalesRequestType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Keyword to search by model or sub model',
  })
  keyword?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  @ApiPropertyOptional({
    description: 'Car active status. If not provided, it will return all cars',
  })
  isActive?: boolean;

  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  page: number;

  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ default: 10, description: 'Page size' })
  pageSize: number;
}
