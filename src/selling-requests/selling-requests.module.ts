import { Module } from '@nestjs/common';
import { SellingRequestsService } from './selling-requests.service';
import { SellingRequestsController } from './selling-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellingRequest } from '@/selling-requests/entities/selling-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SellingRequest])],
  providers: [SellingRequestsService],
  controllers: [SellingRequestsController],
})
export class SellingRequestsModule {}
