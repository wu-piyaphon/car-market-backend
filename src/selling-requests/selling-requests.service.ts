import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { CreateSellingRequestDto } from '@/selling-requests/dtos/create-selling-request.dto';
import { SellingRequestListQueryDto } from '@/selling-requests/dtos/selling-request-list-query.dto';
import { SellingRequestListResponseDto } from '@/selling-requests/dtos/selling-request-list-response.dto';
import { UpdateSellingRequestDto } from '@/selling-requests/dtos/update-selling-request.dto';
import { SellingRequest } from '@/selling-requests/entities/selling-request.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class SellingRequestsService {
  constructor(
    @InjectRepository(SellingRequest)
    private sellingRequestRepository: Repository<SellingRequest>,
  ) {}

  async createSellingRequest(
    createSellingRequestDto: CreateSellingRequestDto,
  ): Promise<SellingRequest> {
    const newSellingRequest = this.sellingRequestRepository.create(
      createSellingRequestDto,
    );
    return this.sellingRequestRepository.save(newSellingRequest);
  }

  async findAllPaginated(
    query: SellingRequestListQueryDto,
  ): Promise<PaginationResponseDto<SellingRequestListResponseDto>> {
    const { page = 1, pageSize = 10, type, keyword, status } = query;

    const qb = this.sellingRequestRepository
      .createQueryBuilder('request')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (type) {
      qb.andWhere('request.type = :type', { type });
    }

    if (status) {
      qb.andWhere('request.status = :status', { status });
    }

    if (keyword) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(request.firstName) LIKE LOWER(:keyword)', {
            keyword: `%${keyword}%`,
          })
            .orWhere('LOWER(request.lastName) LIKE LOWER(:keyword)', {
              keyword: `%${keyword}%`,
            })
            .orWhere('LOWER(request.nickname) LIKE LOWER(:keyword)', {
              keyword: `%${keyword}%`,
            })
            .orWhere('LOWER(request.phoneNumber) LIKE LOWER(:keyword)', {
              keyword: `%${keyword}%`,
            });
        }),
      );
    }

    const [sellingRequests, total] = await qb.getManyAndCount();

    return {
      items: sellingRequests.map(
        (sellingRequest) => new SellingRequestListResponseDto(sellingRequest),
      ),
      page,
      pageSize,
      total,
    };
  }

  async findOneById(id: string): Promise<SellingRequest> {
    const sellingRequest = await this.sellingRequestRepository.findOne({
      where: { id },
    });
    if (!sellingRequest) {
      throw new NotFoundException('Selling request not found');
    }
    return sellingRequest;
  }

  async updateSellingRequest(
    id: string,
    updateSellingRequestDto: UpdateSellingRequestDto,
  ): Promise<SellingRequest> {
    const sellingRequestToUpdate = await this.findOneById(id);

    const updatedSellingRequest = this.sellingRequestRepository.merge(
      sellingRequestToUpdate,
      updateSellingRequestDto,
    );

    return this.sellingRequestRepository.save(updatedSellingRequest);
  }

  async deleteSellingRequest(id: string): Promise<void> {
    const sellingRequestToDelete = await this.findOneById(id);
    await this.sellingRequestRepository.remove(sellingRequestToDelete);
  }
}
