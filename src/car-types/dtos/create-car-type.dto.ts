import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class CreateCarTypeDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  name: string;
}
