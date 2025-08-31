import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SellingRequestsService } from './selling-requests.service';
import { SellingRequest } from './entities/selling-request.entity';
import { CreateSellingRequestDto } from './dtos/create-selling-request.dto';
import { UpdateSellingRequestDto } from './dtos/update-selling-request.dto';
import { SellingRequestListQueryDto } from './dtos/selling-request-list-query.dto';
import {
  RequestContactStatus,
  SalesRequestType,
} from '@/common/enums/request.enum';

describe('SellingRequestsService', () => {
  let service: SellingRequestsService;
  let repository: Repository<SellingRequest>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockQueryBuilder = {
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellingRequestsService,
        {
          provide: getRepositoryToken(SellingRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SellingRequestsService>(SellingRequestsService);
    repository = module.get<Repository<SellingRequest>>(
      getRepositoryToken(SellingRequest),
    );

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a selling request', async () => {
      const createDto: CreateSellingRequestDto = {
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
      };

      const expectedResult: SellingRequest = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
      };

      mockRepository.create.mockReturnValue(expectedResult);
      mockRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(expectedResult);
    });

    it('should handle repository errors during creation', async () => {
      const createDto: CreateSellingRequestDto = {
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.CONSIGNMENT,
      };

      mockRepository.create.mockReturnValue({});
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createDto)).rejects.toThrow('Database error');
      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated selling requests without filters', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
      };

      const mockSellingRequests: SellingRequest[] = [
        {
          id: 'selling-request-1',
          firstName: 'John',
          lastName: 'Doe',
          nickname: 'Johnny',
          phoneNumber: '1234567890',
          type: SalesRequestType.OWNER,
          status: RequestContactStatus.NOT_CONTACTED,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedBy: null,
        },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockSellingRequests,
        1,
      ]);

      const result = await service.findAllPaginated(query);

      expect(result).toEqual({
        items: expect.any(Array),
        total: 1,
        page: 1,
        pageSize: 10,
      });
      expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('request');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
    });

    it('should return paginated selling requests with all filters', async () => {
      const query: SellingRequestListQueryDto = {
        page: 2,
        pageSize: 5,
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.CONTACTED,
        keyword: 'John',
      };

      const mockSellingRequests: SellingRequest[] = [];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockSellingRequests,
        0,
      ]);

      const result = await service.findAllPaginated(query);

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 2,
        pageSize: 5,
      });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'request.type = :type',
        { type: SalesRequestType.OWNER },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'request.status = :status',
        { status: RequestContactStatus.CONTACTED },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });

    it('should apply type filter when provided', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
        type: SalesRequestType.CONSIGNMENT,
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAllPaginated(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'request.type = :type',
        { type: SalesRequestType.CONSIGNMENT },
      );
    });

    it('should apply status filter when provided', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
        status: RequestContactStatus.NOT_CONTACTED,
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAllPaginated(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'request.status = :status',
        { status: RequestContactStatus.NOT_CONTACTED },
      );
    });

    it('should apply keyword filter when provided', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
        keyword: 'searchTerm',
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAllPaginated(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });

    it('should handle repository errors during pagination', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
      };

      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAllPaginated(query)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findOneById', () => {
    it('should return a selling request when found', async () => {
      const id = 'selling-request-uuid';
      const expectedResult: SellingRequest = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOneById(id);

      expect(result).toEqual(expectedResult);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw NotFoundException when selling request not found', async () => {
      const id = 'non-existent-uuid';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById(id)).rejects.toThrow(
        new NotFoundException('Selling request not found'),
      );
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should handle repository errors during findOne', async () => {
      const id = 'selling-request-uuid';

      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findOneById(id)).rejects.toThrow('Database error');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a selling request successfully', async () => {
      const id = 'selling-request-uuid';
      const updateDto: UpdateSellingRequestDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        status: RequestContactStatus.CONTACTED,
        note: 'Customer contacted successfully',
      };
      const userId = 'user-uuid';

      const existingSellingRequest: SellingRequest = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
      };

      const mergedSellingRequest: SellingRequest = {
        ...existingSellingRequest,
        firstName: 'Jane',
        lastName: 'Smith',
        status: RequestContactStatus.CONTACTED,
        note: 'Customer contacted successfully',
      };

      const expectedResult: SellingRequest = {
        ...mergedSellingRequest,
        updatedBy: { id: userId } as any,
      };

      mockRepository.findOne.mockResolvedValue(existingSellingRequest);
      mockRepository.merge.mockReturnValue(mergedSellingRequest);
      mockRepository.save.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateDto, userId);

      expect(result).toEqual(expectedResult);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledWith(
        existingSellingRequest,
        updateDto,
      );
      expect(repository.save).toHaveBeenCalledWith({
        ...mergedSellingRequest,
        updatedBy: { id: userId },
      });
    });

    it('should throw NotFoundException when selling request to update not found', async () => {
      const id = 'non-existent-uuid';
      const updateDto: UpdateSellingRequestDto = {
        status: RequestContactStatus.CONTACTED,
        note: 'Test note',
      };
      const userId = 'user-uuid';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDto, userId)).rejects.toThrow(
        new NotFoundException('Selling request not found'),
      );
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should handle repository errors during update', async () => {
      const id = 'selling-request-uuid';
      const updateDto: UpdateSellingRequestDto = {
        status: RequestContactStatus.CONTACTED,
        note: 'Test note',
      };
      const userId = 'user-uuid';

      const existingSellingRequest: SellingRequest = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(existingSellingRequest);
      mockRepository.merge.mockReturnValue(existingSellingRequest);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.update(id, updateDto, userId)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('delete', () => {
    it('should delete a selling request successfully', async () => {
      const id = 'selling-request-uuid';
      const sellingRequestToDelete: SellingRequest = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(sellingRequestToDelete);
      mockRepository.remove.mockResolvedValue(sellingRequestToDelete);

      await service.delete(id);

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.remove).toHaveBeenCalledTimes(1);
      expect(repository.remove).toHaveBeenCalledWith(sellingRequestToDelete);
    });

    it('should throw NotFoundException when selling request to delete not found', async () => {
      const id = 'non-existent-uuid';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(
        new NotFoundException('Selling request not found'),
      );
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should handle repository errors during deletion', async () => {
      const id = 'selling-request-uuid';
      const sellingRequestToDelete: SellingRequest = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(sellingRequestToDelete);
      mockRepository.remove.mockRejectedValue(new Error('Database error'));

      await expect(service.delete(id)).rejects.toThrow('Database error');
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.remove).toHaveBeenCalledTimes(1);
    });
  });
});
