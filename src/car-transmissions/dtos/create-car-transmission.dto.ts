import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class CreateCarTransmissionDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  name: string;
}
