import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SellingRequestsService } from '@/selling-requests/selling-requests.service';
import { SellingRequestListQueryDto } from '@/selling-requests/dtos/selling-request-list-query.dto';
import { CreateSellingRequestDto } from '@/selling-requests/dtos/create-selling-request.dto';
import { UpdateSellingRequestDto } from '@/selling-requests/dtos/update-selling-request.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('selling-requests')
export class SellingRequestsController {
  constructor(
    private readonly sellingRequestsService: SellingRequestsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: SellingRequestListQueryDto,
  ) {
    return this.sellingRequestsService.findAllPaginated(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.sellingRequestsService.findOneById(id);
  }

  @Post()
  async create(@Body() createSellingRequestDto: CreateSellingRequestDto) {
    return this.sellingRequestsService.createSellingRequest(
      createSellingRequestDto,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSellingRequestDto: UpdateSellingRequestDto,
  ) {
    return this.sellingRequestsService.updateSellingRequest(
      id,
      updateSellingRequestDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.sellingRequestsService.deleteSellingRequest(id);
  }
}
