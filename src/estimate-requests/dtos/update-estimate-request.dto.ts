import { RequestContactStatus } from '@/common/enums/request.enum';
import { CreateEstimateRequestDto } from '@/estimate-requests/dtos/create-estimate-request.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEstimateRequestDto extends PartialType(
  CreateEstimateRequestDto,
) {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Estimate request admin note' })
  note: string;

  @IsEnum(RequestContactStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: RequestContactStatus,
    description: 'Estimate request status',
  })
  status: RequestContactStatus;
}
