import { RequestContactStatus } from '@/common/enums/request.enum';
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

  @IsEnum(RequestContactStatus)
  @IsNotEmpty()
  @ApiProperty({
    enum: RequestContactStatus,
    description: 'Selling request status',
  })
  status: RequestContactStatus;
}
