import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsString()
  @IsNotEmpty()
  brandId: string;

  @IsString()
  @IsOptional()
  categoryId: string | null;

  @IsString()
  @IsNotEmpty()
  transmissionId: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  subModel: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  modelYear: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  engineType: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  engineCapacity: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  mileage: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  previousLicensePlate: string;

  @IsString()
  @IsNotEmpty()
  currentLicensePlate: string;
}
