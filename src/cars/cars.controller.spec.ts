import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { CarListQueryDto } from './dtos/car-list-query.dto';
import { UserPayload } from '@/common/interfaces/user-payload.interface';
import { Transmission } from '@/common/enums/transmission.enum';
import { EngineType } from '@/common/enums/engine-type.enum';
import { SalesRequestType } from '@/common/enums/request.enum';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { CarListResponseDto } from './dtos/car-list-response.dto';
import { Car } from './entities/car.entity';

describe('CarsController', () => {
  let controller: CarsController;
  let service: CarsService;

  const mockCarsService = {
    create: jest.fn(),
    findAllPaginated: jest.fn(),
    findOneById: jest.fn(),
    findOneBySlug: jest.fn(),
    update: jest.fn(),
    activate: jest.fn(),
    disable: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: mockCarsService,
        },
      ],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    service = module.get<CarsService>(CarsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a car with files', async () => {
      const createDto: CreateCarDto = {
        typeId: 'type-uuid',
        brandId: 'brand-uuid',
        categoryId: 'category-uuid',
        model: 'Civic',
        subModel: 'Type R',
        transmission: Transmission.MANUAL,
        modelYear: 2020,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
      };

      const files: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'car.jpg',
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

      const user: UserPayload = {
        id: 'user-uuid',
      };

      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
        images: ['image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockCarsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, files, user);

      expect(service.create).toHaveBeenCalledWith(createDto, files, user.id);
      expect(result).toEqual(expectedResult);
    });

    it('should create a car without files', async () => {
      const createDto: CreateCarDto = {
        typeId: 'type-uuid',
        brandId: 'brand-uuid',
        categoryId: null,
        model: 'Civic',
        subModel: 'LX',
        transmission: Transmission.AUTOMATIC,
        modelYear: 2019,
        color: 'Blue',
        engineType: EngineType.GASOLINE,
        engineCapacity: 1600,
        mileage: 25000,
        price: 20000,
        originalLicensePlate: 'OLD-123',
        currentLicensePlate: 'NEW-456',
        salesType: SalesRequestType.CONSIGNMENT,
        isActive: true,
      };

      const files: Express.Multer.File[] = [];
      const user: UserPayload = { id: 'user-uuid' };

      const expectedResult: Car = {
        id: 'car-uuid-2',
        slug: 'honda-civic-lx-2019',
        model: 'Civic',
        subModel: 'LX',
        modelYear: 2019,
        transmission: Transmission.AUTOMATIC,
        color: 'Blue',
        engineType: EngineType.GASOLINE,
        engineCapacity: 1600,
        mileage: 25000,
        price: 20000,
        originalLicensePlate: 'OLD-123',
        currentLicensePlate: 'NEW-456',
        salesType: SalesRequestType.CONSIGNMENT,
        isActive: true,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockCarsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, files, user);

      expect(service.create).toHaveBeenCalledWith(createDto, files, user.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return paginated cars with filters', async () => {
      const query: CarListQueryDto = {
        page: 1,
        pageSize: 10,
        brand: 'Honda',
        type: 'Sedan',
        model: 'Civic',
        transmission: Transmission.MANUAL,
        minPrice: 15000,
        maxPrice: 30000,
        isActive: true,
      };

      const expectedResult: PaginationResponseDto<CarListResponseDto> = {
        items: [
          {
            id: 'car-uuid',
            slug: 'honda-civic-type-r-2020',
            brand: 'Honda',
            type: 'Sedan',
            category: 'Sport',
            thumbnail: 'image-url',
            model: 'Civic',
            subModel: 'Type R',
            modelYear: 2020,
            transmission: Transmission.MANUAL,
            price: 25000,
            originalLicensePlate: 'ABC-123',
            currentLicensePlate: 'XYZ-789',
            isActive: true,
          } as CarListResponseDto,
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      };

      mockCarsService.findAllPaginated.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });

    it('should return paginated cars without filters', async () => {
      const query: CarListQueryDto = {
        page: 1,
        pageSize: 10,
      };

      const expectedResult: PaginationResponseDto<CarListResponseDto> = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      mockCarsService.findAllPaginated.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(service.findAllPaginated).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a car by id', async () => {
      const id = 'car-uuid';
      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
        images: ['image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockCarsService.findOneById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOneById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOneBySlug', () => {
    it('should return a car by slug', async () => {
      const slug = 'honda-civic-type-r-2020';
      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
        images: ['image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockCarsService.findOneBySlug.mockResolvedValue(expectedResult);

      const result = await controller.findOneBySlug(slug);

      expect(service.findOneBySlug).toHaveBeenCalledWith(slug);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a car with files', async () => {
      const id = 'car-uuid';
      const updateDto: UpdateCarDto = {
        model: 'Updated Civic',
        color: 'Black',
        price: 27000,
      };

      const files: Express.Multer.File[] = [
        {
          fieldname: 'files',
          originalname: 'updated-car.jpg',
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

      const user: UserPayload = { id: 'user-uuid' };

      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-updated-civic-type-r-2020',
        model: 'Updated Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Black',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 27000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
        images: ['updated-image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: { id: 'user-uuid' } as any,
      };

      mockCarsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, files, user);

      expect(service.update).toHaveBeenCalledWith(
        id,
        updateDto,
        files,
        user.id,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should update a car without files', async () => {
      const id = 'car-uuid';
      const updateDto: UpdateCarDto = {
        price: 26000,
        isActive: false,
      };

      const files: Express.Multer.File[] = [];
      const user: UserPayload = { id: 'user-uuid' };

      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 26000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: false,
        images: ['image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: { id: 'user-uuid' } as any,
      };

      mockCarsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, files, user);

      expect(service.update).toHaveBeenCalledWith(
        id,
        updateDto,
        files,
        user.id,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('activate', () => {
    it('should activate a car', async () => {
      const id = 'car-uuid';
      const user: UserPayload = { id: 'user-uuid' };

      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
        images: ['image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: { id: 'user-uuid' } as any,
      };

      mockCarsService.activate.mockResolvedValue(expectedResult);

      const result = await controller.activate(id, user);

      expect(service.activate).toHaveBeenCalledWith(id, user.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('disable', () => {
    it('should disable a car', async () => {
      const id = 'car-uuid';
      const user: UserPayload = { id: 'user-uuid' };

      const expectedResult: Car = {
        id: 'car-uuid',
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: EngineType.GASOLINE,
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: false,
        images: ['image-url'],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: { id: 'user-uuid' } as any,
      };

      mockCarsService.disable.mockResolvedValue(expectedResult);

      const result = await controller.disable(id, user);

      expect(service.disable).toHaveBeenCalledWith(id, user.id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a car', async () => {
      const id = 'car-uuid';

      mockCarsService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
