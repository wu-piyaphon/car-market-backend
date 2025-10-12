import { Test, TestingModule } from '@nestjs/testing';
import { EstimateRequestsController } from './estimate-requests.controller';
import { EstimateRequestsService } from './estimate-requests.service';
import { CreateEstimateRequestDto } from './dtos/create-estimate-request.dto';
import { UpdateEstimateRequestDto } from './dtos/update-estimate-request.dto';
import { EstimateRequestListQueryDto } from './dtos/estimate-request-list-query.dto';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { RequestContactStatus } from '@/common/enums/request.enum';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { EstimateRequestListResponseDto } from './dtos/estimate-request-list-response.dto';
import { EstimateRequest } from './entities/estimate-request.entity';

describe('EstimateRequestsController', () => {
  let controller: EstimateRequestsController;
  let service: EstimateRequestsService;

  const mockEstimateRequestsService = {
    create: jest.fn(),
    findAllPaginated: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimateRequestsController],
      providers: [
        {
          provide: EstimateRequestsService,
          useValue: mockEstimateRequestsService,
        },
      ],
    }).compile();

    controller = module.get<EstimateRequestsController>(
      EstimateRequestsController,
    );
    service = module.get<EstimateRequestsService>(EstimateRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an estimate request', async () => {
      const createDto: CreateEstimateRequestDto = {
        brand: 'BRAND',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        remainingInstallmentAmount: 12,
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

      const expectedResult: EstimateRequest = {
        id: 'estimate-uuid',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        remainingInstallmentAmount: 12,
        images: ['image-url'],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: null,
      };

      mockEstimateRequestsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, files);

      expect(service.create).toHaveBeenCalledWith(createDto, files);
      expect(result).toEqual(expectedResult);
    });

    it('should create an estimate request without files', async () => {
      const createDto: CreateEstimateRequestDto = {
        brand: 'BRAND',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: null,
        remainingInstallmentAmount: null,
      };

      const files: Express.Multer.File[] = [];

      const expectedResult: EstimateRequest = {
        id: 'estimate-uuid',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: null,
        remainingInstallmentAmount: null,
        images: [],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: null,
      };

      mockEstimateRequestsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, files);

      expect(service.create).toHaveBeenCalledWith(createDto, files);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated estimate requests', async () => {
      const query: EstimateRequestListQueryDto = {
        page: 1,
        pageSize: 10,
        keyword: 'test',
        status: RequestContactStatus.NOT_CONTACTED,
      };

      const expectedResult: PaginationResponseDto<EstimateRequestListResponseDto> =
        {
          items: [
            {
              id: 'estimate-uuid',
              firstName: 'John',
              phoneNumber: '1234567890',
              model: 'Test Model',
              modelYear: 2020,
              brand: 'Test Brand',
              thumbnail: 'image-url',
              note: '',
              type: undefined,
              status: RequestContactStatus.NOT_CONTACTED,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as EstimateRequestListResponseDto,
          ],
          total: 1,
          page: 1,
          pageSize: 10,
        };

      mockEstimateRequestsService.findAllPaginated.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAll(query);

      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });

    it('should return paginated estimate requests without filters', async () => {
      const query: EstimateRequestListQueryDto = {
        page: 1,
        pageSize: 10,
      };

      const expectedResult: PaginationResponseDto<EstimateRequestListResponseDto> =
        {
          items: [],
          total: 0,
          page: 1,
          pageSize: 10,
        };

      mockEstimateRequestsService.findAllPaginated.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAll(query);

      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return an estimate request by id', async () => {
      const id = 'estimate-uuid';
      const expectedResult: EstimateRequest = {
        id: 'estimate-uuid',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        remainingInstallmentAmount: 12,
        images: ['image-url'],
        status: RequestContactStatus.NOT_CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: null,
      };

      mockEstimateRequestsService.findOneById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
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
      const user: UserPayload = {
        id: 'user-uuid',
      };

      const expectedResult: EstimateRequest = {
        id: 'estimate-uuid',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'Updated John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        remainingInstallmentAmount: 12,
        images: ['image-url'],
        status: RequestContactStatus.CONTACTED,
        note: 'Updated note',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: { id: 'user-uuid' } as any,
      };

      mockEstimateRequestsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, user);

      expect(service.update).toHaveBeenCalledWith(id, updateDto, user.id);
      expect(result).toEqual(expectedResult);
    });

    it('should update estimate request with partial data', async () => {
      const id = 'estimate-uuid';
      const updateDto: UpdateEstimateRequestDto = {
        status: RequestContactStatus.CONTACTED,
      } as UpdateEstimateRequestDto;
      const user: UserPayload = {
        id: 'user-uuid',
      };

      const expectedResult: EstimateRequest = {
        id: 'estimate-uuid',
        model: 'Test Model',
        modelYear: 2020,
        firstName: 'John',
        phoneNumber: '1234567890',
        lineId: 'line123',
        remainingInstallmentAmount: 12,
        images: ['image-url'],
        status: RequestContactStatus.CONTACTED,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        updatedBy: { id: 'user-uuid' } as any,
      };

      mockEstimateRequestsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, user);

      expect(service.update).toHaveBeenCalledWith(id, updateDto, user.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete an estimate request', async () => {
      const id = 'estimate-uuid';

      mockEstimateRequestsService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
