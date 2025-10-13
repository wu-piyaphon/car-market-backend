import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  IsUrl,
} from 'class-validator';

export class ImportBrandDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({}, { message: 'imageUrl must be a valid URL' })
  @IsOptional()
  imageUrl?: string;
}

export class ImportBrandsDto {
  @IsNotEmpty()
  brands: ImportBrandDto[];
}
