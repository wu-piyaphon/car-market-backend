import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CarTypesService } from '@/car-types/car-types.service';
import { CreateCarTypeDto } from '@/car-types/dtos/create-car-type.dto';
import { UpdateCarTypeDto } from '@/car-types/dtos/update-car-type.dto';
import { CarType } from '@/car-types/entities/car-type.entity';
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

@Controller('car-types')
@UseGuards(JwtAuthGuard)
export class CarTypesController {
  constructor(private readonly carTypesService: CarTypesService) {}

  @Get()
  findAll(): Promise<CarType[]> {
    return this.carTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CarType> {
    return this.carTypesService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createCarTypeDto: CreateCarTypeDto,
    @UploadedFile(ImageFileValidationPipe) file: Express.Multer.File,
  ): Promise<CarType> {
    return this.carTypesService.create(createCarTypeDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateCarTypeDto: UpdateCarTypeDto,
    @UploadedFile(OptionalImageFileValidationPipe) file: Express.Multer.File,
  ): Promise<CarType> {
    return this.carTypesService.update(id, updateCarTypeDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.carTypesService.remove(id);
  }
}
