import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsString()
  @IsNotEmpty()
  brandId: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  subModel: string;

  @IsNumber()
  @IsNotEmpty()
  modelYear: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  transmissionId: string;

  @IsString()
  @IsNotEmpty()
  engineType: string;

  @IsNumber()
  @IsNotEmpty()
  engineCapacity: number;

  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  previousLicensePlate: string;

  @IsString()
  @IsNotEmpty()
  currentLicensePlate: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
