import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CreateCarBrandDto } from '@/car-brands/dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from '@/car-brands/dtos/update-car-brand.dto';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { ImageFileValidationPipe } from '@/common/pipes/file-validation.presets';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('car-brands')
export class CarBrandsController {
  constructor(private readonly carBrandsService: CarBrandsService) {}

  @Get()
  findAll(): Promise<CarBrand[]> {
    return this.carBrandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarBrand> {
    return this.carBrandsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCarBrandDto: CreateCarBrandDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ): Promise<CarBrand> {
    return this.carBrandsService.create(createCarBrandDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateCarBrandDto: UpdateCarBrandDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ): Promise<CarBrand> {
    return this.carBrandsService.update(id, updateCarBrandDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.carBrandsService.remove(id);
  }
}
