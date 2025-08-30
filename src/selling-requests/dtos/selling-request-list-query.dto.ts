import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import {
  RequestContactStatus,
  SalesRequestType,
} from '@/common/enums/request.enum';
import { Transform } from 'class-transformer';
import { toNumber } from '@/common/utils/transform.utils';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SellingRequestListQueryDto {
  @IsOptional()
  @IsEnum(SalesRequestType)
  @ApiPropertyOptional({
    enum: SalesRequestType,
    description: 'Selling request type',
  })
  type?: SalesRequestType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      'Keyword to search by first name, last name, nickname, or phone number',
  })
  keyword?: string;

  @IsOptional()
  @IsEnum(RequestContactStatus)
  @ApiPropertyOptional({
    enum: RequestContactStatus,
    description: 'Selling request status',
  })
  status?: RequestContactStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value) ?? 1)
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  page: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => toNumber(value) ?? 10)
  @ApiPropertyOptional({ default: 10, description: 'Page size' })
  pageSize: number;
}
