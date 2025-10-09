import { Test, TestingModule } from '@nestjs/testing';
import { EstimateRequestsService } from './estimate-requests.service';
import { EstimateRequest } from './entities/estimate-request.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateEstimateRequestDto } from './dtos/create-estimate-request.dto';
import { UpdateEstimateRequestDto } from './dtos/update-estimate-request.dto';
import { EstimateRequestListQueryDto } from './dtos/estimate-request-list-query.dto';
import { RequestContactStatus } from '@/common/enums/request.enum';
import { EstimateRequestListResponseDto } from './dtos/estimate-request-list-response.dto';
import { CarBrandsService } from '@/car-brands/car-brands.service';

describe('EstimateRequestsService', () => {
  let service: EstimateRequestsService;
  let repository: Repository<EstimateRequest>;
  let awsS3Service: AwsS3Service;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockAwsS3Service = {
    uploadFile: jest.fn(),
  };

  const mockCarBrandsService = {
    findByName: jest.fn(),
    findOne: jest.fn(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstimateRequestsService,
        {
          provide: getRepositoryToken(EstimateRequest),
          useValue: mockRepository,
        },
        {
          provide: AwsS3Service,
          useValue: mockAwsS3Service,
        },
        {
          provide: CarBrandsService,
          useValue: mockCarBrandsService,
        },
      ],
    }).compile();

    service = module.get<EstimateRequestsService>(EstimateRequestsService);
    repository = module.get<Repository<EstimateRequest>>(
      getRepositoryToken(EstimateRequest),
    );
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an estimate request with files', async () => {
      const createDto: CreateEstimateRequestDto = {
        brand: 'Toyota',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        installmentsInMonth: 12,
      };

      const files: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'test.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
          size: 1000,
          stream: null,
          destination: '',
          filename: '',
          path: '',
        },
      ];

      const uploadedImageUrls = ['https://s3.amazonaws.com/image1.jpg'];
      const createdEntity = {
        ...createDto,
        images: uploadedImageUrls,
        brand: { id: createDto.brand },
      };
      const savedEntity: EstimateRequest = {
        id: 'estimate-uuid',
        model: createDto.model,
        modelYear: createDto.modelYear,
        firstName: createDto.firstName,
        phoneNumber: createDto.phoneNumber,
        lineId: createDto.lineId,
        installmentsInMonth: createDto.installmentsInMonth,
        images: uploadedImageUrls,
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: { id: createDto.brand, name: createDto.brand } as any,
        updatedBy: null,
      };

      mockCarBrandsService.findByName.mockResolvedValue({
        id: createDto.brand,
      } as any);
      mockAwsS3Service.uploadFile.mockResolvedValue(uploadedImageUrls[0]);
      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(createDto, files);

      expect(awsS3Service.uploadFile).toHaveBeenCalledWith(
        files[0],
        'estimate-requests',
      );
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        images: uploadedImageUrls,
        brand: { id: createDto.brand },
      });
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(savedEntity);
    });

    it('should create an estimate request without files', async () => {
      const createDto: CreateEstimateRequestDto = {
        brand: 'Toyota',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: null,
        installmentsInMonth: null,
      };

      const files: Express.Multer.File[] = [];
      const createdEntity = {
        ...createDto,
        images: [],
        brand: { id: createDto.brand },
      };
      const savedEntity: EstimateRequest = {
        id: 'estimate-uuid',
        model: createDto.model,
        modelYear: createDto.modelYear,
        firstName: createDto.firstName,
        phoneNumber: createDto.phoneNumber,
        lineId: null,
        installmentsInMonth: null,
        images: [],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: null,
      };

      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(createDto, files);

      expect(awsS3Service.uploadFile).not.toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        images: [],
        brand: { id: createDto.brand },
      });
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(savedEntity);
    });
  });

  describe('findAllPaginated', () => {
    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return paginated estimate requests with filters', async () => {
      const query: EstimateRequestListQueryDto = {
        page: 1,
        pageSize: 10,
        keyword: 'test',
        status: RequestContactStatus.NOT_CONTACTED,
      };

      const mockEstimateRequests: EstimateRequest[] = [
        {
          id: 'estimate-uuid',
          model: 'Test Model',
          modelYear: 2020,
          firstName: 'John',
          phoneNumber: '1234567890',
          lineId: 'line123',
          installmentsInMonth: 12,
          images: ['image-url'],
          status: RequestContactStatus.NOT_CONTACTED,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          brand: { id: 'brand-uuid', name: 'Test Brand' } as any,
          updatedBy: null,
        },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockEstimateRequests,
        1,
      ]);

      const result = await service.findAllPaginated(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('request');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'request.brand',
        'brand',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2); // keyword and status
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();

      expect(result).toEqual({
        items: expect.arrayContaining([
          expect.any(EstimateRequestListResponseDto),
        ]),
        total: 1,
        page: 1,
        pageSize: 10,
      });
    });

    it('should return paginated estimate requests without filters', async () => {
      const query: EstimateRequestListQueryDto = {
        page: 2,
        pageSize: 5,
      };

      const mockEstimateRequests: EstimateRequest[] = [];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockEstimateRequests,
        0,
      ]);

      const result = await service.findAllPaginated(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('request');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5); // (page - 1) * pageSize
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 2,
        pageSize: 5,
      });
    });
  });

  describe('findOneById', () => {
    it('should return an estimate request by id', async () => {
      const id = 'estimate-uuid';
      const estimateRequest: EstimateRequest = {
        id,
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        installmentsInMonth: 12,
        images: ['image-url'],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(estimateRequest);

      const result = await service.findOneById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(estimateRequest);
    });

    it('should throw NotFoundException if estimate request not found', async () => {
      const id = 'non-existent-uuid';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById(id)).rejects.toThrow(
        new NotFoundException('Estimate request not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('update', () => {
    it('should update an estimate request', async () => {
      const id = 'estimate-uuid';
      const updateDto: UpdateEstimateRequestDto = {
        note: 'Updated note',
        status: RequestContactStatus.CONTACTED,
        firstName: 'Updated John',
      };
      const userId = 'user-uuid';

      const existingEstimateRequest: EstimateRequest = {
        id,
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        installmentsInMonth: 12,
        images: ['image-url'],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: { id: 'Toyota' } as any,
        updatedBy: null,
      };

      const updatedEstimateRequest: EstimateRequest = {
        ...existingEstimateRequest,
        ...updateDto,
        brand: existingEstimateRequest.brand,
        updatedBy: { id: userId } as any,
      };

      mockRepository.findOne.mockResolvedValue(existingEstimateRequest);
      mockCarBrandsService.findByName.mockResolvedValue(undefined);
      mockRepository.save.mockResolvedValue(updatedEstimateRequest);

      const result = await service.update(id, updateDto, userId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockCarBrandsService.findByName).toHaveBeenCalledWith(undefined);
      expect(repository.merge).toHaveBeenCalledWith(existingEstimateRequest, {
        ...updateDto,
        brand: undefined,
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingEstimateRequest,
        updatedBy: { id: userId },
      });
      expect(result).toEqual(updatedEstimateRequest);
    });

    it('should throw NotFoundException if estimate request not found during update', async () => {
      const id = 'non-existent-uuid';
      const updateDto: UpdateEstimateRequestDto = {
        note: 'Updated note',
        status: RequestContactStatus.CONTACTED,
      };
      const userId = 'user-uuid';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDto, userId)).rejects.toThrow(
        new NotFoundException('Estimate request not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.merge).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete an estimate request', async () => {
      const id = 'estimate-uuid';
      const estimateRequest: EstimateRequest = {
        id,
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        installmentsInMonth: 12,
        images: ['image-url'],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(estimateRequest);
      mockRepository.remove.mockResolvedValue(estimateRequest);

      await service.delete(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.remove).toHaveBeenCalledWith(estimateRequest);
    });

    it('should throw NotFoundException if estimate request not found during delete', async () => {
      const id = 'non-existent-uuid';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(
        new NotFoundException('Estimate request not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
