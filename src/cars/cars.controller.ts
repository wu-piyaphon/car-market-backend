import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CarsService } from '@/cars/cars.service';
import { CarListQueryDto } from '@/cars/dtos/car-list-query.dto';
import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { UpdateCarDto } from '@/cars/dtos/update-car.dto';
import { User } from '@/common/decorators/user.decorator';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { ImageFileValidationPipe } from '@/common/pipes/file-validation.presets';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
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

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: CarListQueryDto,
  ) {
    return this.carsService.findAllPaginated(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.carsService.findOneById(id);
  }

  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.carsService.findOneBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @User() user: UserPayload,
  ) {
    const userId = user.id;
    return this.carsService.update(id, updateCarDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.carsService.delete(id);
  }
}
