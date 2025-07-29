import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { SalesRequestStatus, SalesType } from '@/common/enums/sales-type.enum';
import { Transform } from 'class-transformer';
import { toNumber } from '@/common/utils/transform.utils';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SellingRequestListQueryDto {
  @IsOptional()
  @IsEnum(SalesType)
  @ApiPropertyOptional({ enum: SalesType, description: 'Selling request type' })
  type?: SalesType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'Keyword to search by first name, last name, nickname, or phone number',
  })
  keyword?: string;

  @IsOptional()
  @IsEnum(SalesRequestStatus)
  @ApiPropertyOptional({
    enum: SalesRequestStatus,
    description: 'Selling request status',
  })
  status?: SalesRequestStatus;

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
