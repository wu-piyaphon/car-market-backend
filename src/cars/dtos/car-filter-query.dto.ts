import { EngineType } from '@/common/enums/engine-type.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CarFilterQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car type name' })
  type?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car brand name' })
  brand?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (!value ? undefined : value))
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
  @Transform(({ value }) => Number(value))
  @ApiPropertyOptional({ description: 'Car model year' })
  modelYear?: number;

  @IsOptional()
  @IsEnum(EngineType)
  @Transform(({ value }) => (!value ? undefined : value))
  @ApiPropertyOptional({ description: 'Car engine type', enum: EngineType })
  engineType?: EngineType;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiPropertyOptional({ description: 'Car engine capacity' })
  engineCapacity?: number;
}
