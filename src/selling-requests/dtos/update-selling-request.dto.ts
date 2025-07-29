import { SalesRequestStatus } from '@/common/enums/sales-request.enum';
import { CreateSellingRequestDto } from '@/selling-requests/dtos/create-selling-request.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSellingRequestDto extends PartialType(
  CreateSellingRequestDto,
) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Selling request admin note' })
  note: string;

  @IsEnum(SalesRequestStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: SalesRequestStatus,
    description: 'Selling request status',
  })
  status: SalesRequestStatus;
}
