import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { RequestContactStatus } from '@/common/enums/request.enum';
import { toNumber } from '@/common/utils/transform.utils';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class EstimateRequestListQueryDto {
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
    description: 'Estimate request status',
  })
  status?: RequestContactStatus;

  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  page: number;

  @IsNumber()
  @Transform(({ value }) => toNumber(value))
  @ApiPropertyOptional({ default: 10, description: 'Page size' })
  pageSize: number;
}
