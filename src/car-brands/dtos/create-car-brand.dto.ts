import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCarBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
