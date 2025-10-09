import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class CreateCarCategoryDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  name: string;
}
