import { SalesType } from '@/common/enums/sales-type.enum';
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

  @IsEnum(SalesType)
  @IsNotEmpty()
  @ApiProperty({
    enum: SalesType,
    description: 'Selling request type',
  })
  type: SalesType;
}
