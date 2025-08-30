import { Module } from '@nestjs/common';
import { EstimateRequestsController } from './estimate-requests.controller';
import { EstimateRequestsService } from './estimate-requests.service';
import { CommonModule } from '@/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimateRequest } from '@/estimate-requests/entities/estimate-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstimateRequest]), CommonModule],
  controllers: [EstimateRequestsController],
  providers: [EstimateRequestsService],
})
export class EstimateRequestsModule {}
