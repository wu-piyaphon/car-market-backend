import { EngineType } from '@/common/enums/engine-types.enum';
import { SalesType } from '@/common/enums/sales-types.enum';
import { toNumber } from '@/common/utils/transform.utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car type UUID' })
  typeId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car brand UUID' })
  brandId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Car category UUID' })
  categoryId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car transmission UUID' })
  transmissionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car model' })
  model: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car sub model' })
  subModel: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => toNumber(value))
  @ApiProperty({ description: 'Car model year' })
  modelYear: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car color' })
  color: string;

  @IsEnum(EngineType)
  @IsNotEmpty()
  @ApiProperty({ description: 'Car engine type', enum: EngineType })
  engineType: EngineType;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => toNumber(value))
  @ApiProperty({ description: 'Car engine capacity' })
  engineCapacity: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @ApiProperty({ description: 'Car mileage' })
  mileage: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => toNumber(value))
  @ApiProperty({ description: 'Car price' })
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Car previous license plate' })
  previousLicensePlate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car current license plate' })
  currentLicensePlate: string;

  @IsEnum(SalesType)
  @IsNotEmpty()
  @ApiProperty({ description: 'Car sales type', enum: SalesType })
  salesType: SalesType;
}
