import { Test, TestingModule } from '@nestjs/testing';
import { CarBrandsController } from './car-brands.controller';
import { CarBrandsService } from './car-brands.service';
import { CreateCarBrandDto } from './dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from './dtos/update-car-brand.dto';
import { CarBrand } from './entities/car-brand.entity';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

describe('CarBrandsController', () => {
  let controller: CarBrandsController;
  let service: CarBrandsService;

  const mockCarBrandsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarBrandsController],
      providers: [
        {
          provide: CarBrandsService,
          useValue: mockCarBrandsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<CarBrandsController>(CarBrandsController);
    service = module.get<CarBrandsService>(CarBrandsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of car brands', async () => {
      const expectedResult: CarBrand[] = [
        {
          id: 'brand-uuid-1',
          name: 'Toyota',
          image: 'toyota-image-url',
          cars: [],
          estimateRequests: [],
        },
        {
          id: 'brand-uuid-2',
          name: 'Honda',
          image: 'honda-image-url',
          cars: [],
          estimateRequests: [],
        },
      ];

      mockCarBrandsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('should return empty array when no car brands exist', async () => {
      const expectedResult: CarBrand[] = [];

      mockCarBrandsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a car brand by id', async () => {
      const carBrandId = 'brand-uuid-1';
      const expectedResult: CarBrand = {
        id: carBrandId,
        name: 'Toyota',
        image: 'toyota-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(carBrandId);

      expect(result).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(carBrandId);
    });

    it('should return a different car brand by different id', async () => {
      const carBrandId = 'brand-uuid-2';
      const expectedResult: CarBrand = {
        id: carBrandId,
        name: 'Honda',
        image: 'honda-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(carBrandId);

      expect(result).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(carBrandId);
    });
  });

  describe('create', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'toyota-logo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };

    it('should create a car brand with file', async () => {
      const createCarBrandDto: CreateCarBrandDto = {
        id: 'NISSAN',
        name: 'Nissan',
      };
      const expectedResult: CarBrand = {
        id: 'new-brand-uuid',
        name: 'Nissan',
        image: 'nissan-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCarBrandDto, mockFile);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createCarBrandDto, mockFile);
    });

    it('should create a car brand with different name', async () => {
      const createCarBrandDto: CreateCarBrandDto = {
        id: 'BMW',
        name: 'BMW',
      };
      const expectedResult: CarBrand = {
        id: 'another-brand-uuid',
        name: 'BMW',
        image: 'bmw-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCarBrandDto, mockFile);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createCarBrandDto, mockFile);
    });
  });

  describe('update', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'updated-logo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 1024,
      stream: null,
      destination: '',
      filename: '',
      path: '',
    };

    it('should update a car brand with file', async () => {
      const carBrandId = 'brand-uuid-1';
      const updateCarBrandDto: UpdateCarBrandDto = {
        name: 'Updated Toyota',
      };
      const expectedResult: CarBrand = {
        id: carBrandId,
        name: 'Updated Toyota',
        image: 'updated-toyota-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        carBrandId,
        updateCarBrandDto,
        mockFile,
      );

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        carBrandId,
        updateCarBrandDto,
        mockFile,
      );
    });

    it('should update a car brand without file', async () => {
      const carBrandId = 'brand-uuid-2';
      const updateCarBrandDto: UpdateCarBrandDto = {
        name: 'Updated Honda',
      };
      const expectedResult: CarBrand = {
        id: carBrandId,
        name: 'Updated Honda',
        image: 'existing-honda-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        carBrandId,
        updateCarBrandDto,
        null,
      );

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        carBrandId,
        updateCarBrandDto,
        null,
      );
    });

    it('should update only specific fields', async () => {
      const carBrandId = 'brand-uuid-3';
      const updateCarBrandDto: UpdateCarBrandDto = {}; // Empty update (partial)
      const expectedResult: CarBrand = {
        id: carBrandId,
        name: 'Existing Name',
        image: 'new-image-url',
        cars: [],
        estimateRequests: [],
      };

      mockCarBrandsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        carBrandId,
        updateCarBrandDto,
        mockFile,
      );

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        carBrandId,
        updateCarBrandDto,
        mockFile,
      );
    });
  });

  describe('remove', () => {
    it('should remove a car brand', async () => {
      const carBrandId = 'brand-uuid-1';

      mockCarBrandsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(carBrandId);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(carBrandId);
    });

    it('should remove a different car brand', async () => {
      const carBrandId = 'brand-uuid-2';

      mockCarBrandsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(carBrandId);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(carBrandId);
    });
  });
});
