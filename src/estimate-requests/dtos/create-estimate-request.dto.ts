import { toNumber } from '@/common/utils/transform.utils';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateEstimateRequestDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car brand UUID' })
  brandId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Car model' })
  model: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => toNumber(value))
  @ApiProperty({ description: 'Car model year' })
  modelYear: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Estimate request user first name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Estimate request user phone number' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value ?? null)
  @ApiProperty({ description: 'Estimate request user Line ID' })
  lineId: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? toNumber(value) : null))
  @ApiProperty({
    description: 'Estimate request outstanding installments in month',
  })
  installmentsInMonth: number | null;
}
