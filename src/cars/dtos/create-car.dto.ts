import { EngineType } from '@/common/enums/engine-type.enum';
import { SalesRequestType } from '@/common/enums/request.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { toBoolean, toNumber } from '@/common/utils/transform.utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCarDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car type UUID' })
  typeId: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car brand UUID' })
  brandId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Car category UUID' })
  categoryId: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car model' })
  model: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car sub model' })
  subModel: string;

  @IsEnum(Transmission)
  @IsNotEmpty()
  @ApiProperty({ description: 'Car transmission', enum: Transmission })
  transmission: Transmission;

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
  @ApiProperty({ description: 'Car new license plate' })
  newLicensePlate: string;

  @IsEnum(SalesRequestType)
  @IsNotEmpty()
  @ApiProperty({ description: 'Car sales type', enum: SalesRequestType })
  salesType: SalesRequestType;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @ApiProperty({ description: 'Car active status', default: true })
  isActive?: boolean = true;
}
