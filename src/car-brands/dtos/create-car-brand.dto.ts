import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class CreateCarBrandDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
