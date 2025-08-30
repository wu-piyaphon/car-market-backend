import { SalesRequestType } from '@/common/enums/request.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSellingRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Selling request user first name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Selling request user last name' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Selling request user nickname' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Selling request user phone number' })
  phoneNumber: string;

  @IsEnum(SalesRequestType)
  @IsNotEmpty()
  @ApiProperty({
    enum: SalesRequestType,
    description: 'Selling request type',
  })
  type: SalesRequestType;
}
