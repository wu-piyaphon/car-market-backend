import { EngineType } from '@/common/enums/engine-type.enum';
import { SalesType } from '@/common/enums/sales-type.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { toBoolean, toNumber } from '@/common/utils/transform.utils';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CarListQueryDto {
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car type UUID' })
  type?: string;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car brand UUID' })
  brand?: string;

  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car category UUID' })
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
  @IsEnum(EngineType)
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
  @IsEnum(EngineType)
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car engine type', enum: EngineType })
  engineType?: EngineType;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ description: 'Car engine capacity' })
  engineCapacity?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @Min(0)
  @ApiPropertyOptional({ description: 'Car minimum mileage' })
  minMileage?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
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
  @IsEnum(SalesType)
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ enum: SalesType, description: 'Car sales type' })
  salesType?: SalesType;

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

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ default: 10, description: 'Page size' })
  pageSize?: number = 10;
}
