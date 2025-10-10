import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CreateCarBrandDto } from '@/car-brands/dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from '@/car-brands/dtos/update-car-brand.dto';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import {
  ImageFileValidationPipe,
  OptionalImageFileValidationPipe,
} from '@/common/pipes/file-validation.presets';
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

@Controller('car-brands')
export class CarBrandsController {
  constructor(private readonly carBrandsService: CarBrandsService) {}

  @Get()
  findAll(): Promise<CarBrand[]> {
    return this.carBrandsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<CarBrand> {
    return this.carBrandsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCarBrandDto: CreateCarBrandDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ): Promise<CarBrand> {
    return this.carBrandsService.create(createCarBrandDto, file);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateCarBrandDto: UpdateCarBrandDto,
    @UploadedFile(OptionalImageFileValidationPipe) file: Express.Multer.File,
  ): Promise<CarBrand> {
    return this.carBrandsService.update(id, updateCarBrandDto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.carBrandsService.remove(id);
  }
}
