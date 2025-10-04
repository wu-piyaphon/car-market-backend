import { CarBrandsService } from '@/car-brands/car-brands.service';
import { AwsS3Service } from '@/common/aws-s3.service';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { CreateEstimateRequestDto } from '@/estimate-requests/dtos/create-estimate-request.dto';
import { EstimateRequestListQueryDto } from '@/estimate-requests/dtos/estimate-request-list-query.dto';
import { EstimateRequestListResponseDto } from '@/estimate-requests/dtos/estimate-request-list-response.dto';
import { UpdateEstimateRequestDto } from '@/estimate-requests/dtos/update-estimate-request.dto';
import { EstimateRequest } from '@/estimate-requests/entities/estimate-request.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class EstimateRequestsService {
  constructor(
    @InjectRepository(EstimateRequest)
    private estimateRequestsRepository: Repository<EstimateRequest>,
    private carBrandsService: CarBrandsService,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(
    request: CreateEstimateRequestDto,
    files: Express.Multer.File[],
  ): Promise<EstimateRequest> {
    const images = await Promise.all(
      files.map((file) =>
        this.awsS3Service.uploadFile(file, 'estimate-requests'),
      ),
    );

    const foundBrand = await this.carBrandsService.findByName(request.brand);

    const estimateRequest = this.estimateRequestsRepository.create({
      ...request,
      images,
      brand: foundBrand,
    });

    return this.estimateRequestsRepository.save(estimateRequest);
  }

  async findAllPaginated(
    query: EstimateRequestListQueryDto,
  ): Promise<PaginationResponseDto<EstimateRequestListResponseDto>> {
    const { page, pageSize, keyword, status } = query;

    const qb = this.estimateRequestsRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.brand', 'brand')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (keyword) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(request.firstName) LIKE LOWER(:keyword)', {
            keyword: `%${keyword}%`,
          })
            .orWhere('LOWER(request.phoneNumber) LIKE LOWER(:keyword)', {
              keyword: `%${keyword}%`,
            })
            .orWhere('LOWER(request.model) LIKE LOWER(:keyword)', {
              keyword: `%${keyword}%`,
            })
            .orWhere('LOWER(brand.name) LIKE LOWER(:keyword)', {
              keyword: `%${keyword}%`,
            });
        }),
      );
    }

    if (status) {
      qb.andWhere('request.status = :status', { status });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((item) => new EstimateRequestListResponseDto(item)),
      total,
      page,
      pageSize,
    };
  }

  async findOneById(id: string): Promise<EstimateRequest> {
    const estimateRequest = await this.estimateRequestsRepository.findOne({
      where: { id },
    });
    if (!estimateRequest) {
      throw new NotFoundException('Estimate request not found');
    }
    return estimateRequest;
  }

  async update(
    id: string,
    updateEstimateRequestDto: UpdateEstimateRequestDto,
    userId: string,
  ): Promise<EstimateRequest> {
    const estimateRequestToUpdate = await this.findOneById(id);
    const foundBrand = await this.carBrandsService.findByName(
      updateEstimateRequestDto.brand,
    );

    this.estimateRequestsRepository.merge(estimateRequestToUpdate, {
      ...updateEstimateRequestDto,
      brand: foundBrand,
    });

    return this.estimateRequestsRepository.save({
      ...estimateRequestToUpdate,
      updatedBy: {
        id: userId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    const estimateRequestToDelete = await this.findOneById(id);
    await this.estimateRequestsRepository.remove(estimateRequestToDelete);
  }
}
