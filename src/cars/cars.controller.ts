import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CarsService } from '@/cars/cars.service';
import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { ImageFileValidationPipe } from '@/common/pipes/file-validation.presets';
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles(ImageFileValidationPipe)
    files: Express.Multer.File[],
    @User() user: UserPayload,
  ) {
    const userId = user.id;
    return this.carsService.create(createCarDto, files, userId);
  }
}
