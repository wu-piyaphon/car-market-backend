import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { ImageFileValidationPipe } from '@/common/pipes/file-validation.presets';
import { CreateEstimateRequestDto } from '@/estimate-requests/dtos/create-estimate-request.dto';
import { EstimateRequestListQueryDto } from '@/estimate-requests/dtos/estimate-request-list-query.dto';
import { UpdateEstimateRequestDto } from '@/estimate-requests/dtos/update-estimate-request.dto';
import { EstimateRequestsService } from '@/estimate-requests/estimate-requests.service';
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

@Controller('estimate-requests')
export class EstimateRequestsController {
  constructor(
    private readonly estimateRequestsService: EstimateRequestsService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createEstimateRequestDto: CreateEstimateRequestDto,
    @UploadedFiles(ImageFileValidationPipe) files: Express.Multer.File[],
  ) {
    return this.estimateRequestsService.create(createEstimateRequestDto, files);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: EstimateRequestListQueryDto,
  ) {
    return this.estimateRequestsService.findAllPaginated(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.estimateRequestsService.findOneById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEstimateRequestDto: UpdateEstimateRequestDto,
    @User() user: UserPayload,
  ) {
    return this.estimateRequestsService.update(
      id,
      updateEstimateRequestDto,
      user.id,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.estimateRequestsService.delete(id);
  }
}
