import { Test, TestingModule } from '@nestjs/testing';
import { SellingRequestsController } from './selling-requests.controller';
import { SellingRequestsService } from './selling-requests.service';
import { CreateSellingRequestDto } from './dtos/create-selling-request.dto';
import { UpdateSellingRequestDto } from './dtos/update-selling-request.dto';
import { SellingRequestListQueryDto } from './dtos/selling-request-list-query.dto';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import {
  RequestContactStatus,
  SalesRequestType,
} from '@/common/enums/request.enum';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

describe('SellingRequestsController', () => {
  let controller: SellingRequestsController;
  let service: SellingRequestsService;

  const mockSellingRequestsService = {
    create: jest.fn(),
    findAllPaginated: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellingRequestsController],
      providers: [
        {
          provide: SellingRequestsService,
          useValue: mockSellingRequestsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SellingRequestsController>(
      SellingRequestsController,
    );
    service = module.get<SellingRequestsService>(SellingRequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedResult = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSellingRequestsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle service errors during creation', async () => {
      const createDto: CreateSellingRequestDto = {
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.CONSIGNMENT,
      };

      mockSellingRequestsService.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'Database error',
      );
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated selling requests', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        keyword: 'John',
      };

      const expectedResult: PaginationResponseDto<any> = {
        items: [
          {
            id: 'selling-request-1',
            firstName: 'John',
            lastName: 'Doe',
            nickname: 'Johnny',
            phoneNumber: '1234567890',
            type: SalesRequestType.OWNER,
            status: RequestContactStatus.NOT_CONTACTED,
            note: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        page: 1,
        pageSize: 10,
        total: 1,
      };

      mockSellingRequestsService.findAllPaginated.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAll(query);

      expect(result).toBe(expectedResult);
      expect(service.findAllPaginated).toHaveBeenCalledTimes(1);
      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
    });

    it('should return paginated selling requests with default query', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
      };

      const expectedResult: PaginationResponseDto<any> = {
        items: [],
        page: 1,
        pageSize: 10,
        total: 0,
      };

      mockSellingRequestsService.findAllPaginated.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.findAll(query);

      expect(result).toBe(expectedResult);
      expect(service.findAllPaginated).toHaveBeenCalledTimes(1);
      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
    });

    it('should handle service errors during finding all', async () => {
      const query: SellingRequestListQueryDto = {
        page: 1,
        pageSize: 10,
      };

      mockSellingRequestsService.findAllPaginated.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.findAll(query)).rejects.toThrow('Database error');
      expect(service.findAllPaginated).toHaveBeenCalledTimes(1);
      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a selling request by id', async () => {
      const id = 'selling-request-uuid';
      const expectedResult = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.NOT_CONTACTED,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSellingRequestsService.findOneById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toBe(expectedResult);
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(service.findOneById).toHaveBeenCalledWith(id);
    });

    it('should handle service errors during finding one', async () => {
      const id = 'non-existent-uuid';

      mockSellingRequestsService.findOneById.mockRejectedValue(
        new Error('Selling request not found'),
      );

      await expect(controller.findOne(id)).rejects.toThrow(
        'Selling request not found',
      );
      expect(service.findOneById).toHaveBeenCalledTimes(1);
      expect(service.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a selling request', async () => {
      const id = 'selling-request-uuid';
      const updateDto: UpdateSellingRequestDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        status: RequestContactStatus.CONTACTED,
        note: 'Customer contacted successfully',
      };
      const user: UserPayload = {
        id: 'user-uuid',
      };

      const expectedResult = {
        id: 'selling-request-uuid',
        firstName: 'Jane',
        lastName: 'Smith',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.CONTACTED,
        note: 'Customer contacted successfully',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSellingRequestsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, user);

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateDto, user.id);
    });

    it('should update a selling request with partial data', async () => {
      const id = 'selling-request-uuid';
      const updateDto: UpdateSellingRequestDto = {
        status: RequestContactStatus.CONTACTED,
        note: 'Customer contacted',
      };
      const user: UserPayload = {
        id: 'user-uuid',
      };

      const expectedResult = {
        id: 'selling-request-uuid',
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        phoneNumber: '1234567890',
        type: SalesRequestType.OWNER,
        status: RequestContactStatus.CONTACTED,
        note: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockSellingRequestsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, user);

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateDto, user.id);
    });

    it('should handle service errors during update', async () => {
      const id = 'non-existent-uuid';
      const updateDto: UpdateSellingRequestDto = {
        status: RequestContactStatus.CONTACTED,
        note: 'Test note',
      };
      const user: UserPayload = {
        id: 'user-uuid',
      };

      mockSellingRequestsService.update.mockRejectedValue(
        new Error('Selling request not found'),
      );

      await expect(controller.update(id, updateDto, user)).rejects.toThrow(
        'Selling request not found',
      );
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updateDto, user.id);
    });
  });

  describe('delete', () => {
    it('should delete a selling request', async () => {
      const id = 'selling-request-uuid';
      const expectedResult = { affected: 1 };

      mockSellingRequestsService.delete.mockResolvedValue(expectedResult);

      const result = await controller.delete(id);

      expect(result).toBe(expectedResult);
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(id);
    });

    it('should handle service errors during deletion', async () => {
      const id = 'non-existent-uuid';

      mockSellingRequestsService.delete.mockRejectedValue(
        new Error('Selling request not found'),
      );

      await expect(controller.delete(id)).rejects.toThrow(
        'Selling request not found',
      );
      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
