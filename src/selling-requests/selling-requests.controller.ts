import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { CreateSellingRequestDto } from '@/selling-requests/dtos/create-selling-request.dto';
import { SellingRequestListQueryDto } from '@/selling-requests/dtos/selling-request-list-query.dto';
import { UpdateSellingRequestDto } from '@/selling-requests/dtos/update-selling-request.dto';
import { SellingRequestsService } from '@/selling-requests/selling-requests.service';
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
    return this.sellingRequestsService.create(createSellingRequestDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSellingRequestDto: UpdateSellingRequestDto,
    @User() user: UserPayload,
  ) {
    return this.sellingRequestsService.update(
      id,
      updateSellingRequestDto,
      user.id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.sellingRequestsService.delete(id);
  }
}
