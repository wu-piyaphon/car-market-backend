import { CarBrandsService } from '@/car-brands/car-brands.service';
import { AwsS3Service } from '@/common/aws-s3.service';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { SalesRequestType } from '@/common/enums/request.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarsService } from './cars.service';
import { CarListQueryDto } from './dtos/car-list-query.dto';
import { CarListResponseDto } from './dtos/car-list-response.dto';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';
import { Car } from './entities/car.entity';

// Mock the slug utility
jest.mock('@/common/utils/slug.utils', () => ({
  generateCarSlug: jest.fn(),
}));

import { TRANSMISSION_TRANSLATIONS } from '@/common/constants/translation.constants';
import { generateCarSlug } from '@/common/utils/slug.utils';

describe('CarsService', () => {
  let service: CarsService;
  let repository: Repository<Car>;
  let carBrandsService: CarBrandsService;
  let awsS3Service: AwsS3Service;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockCarBrandsService = {
    findOne: jest.fn(),
  };

  const mockAwsS3Service = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockGenerateCarSlug = generateCarSlug as jest.MockedFunction<
    typeof generateCarSlug
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getRepositoryToken(Car),
          useValue: mockRepository,
        },
        {
          provide: CarBrandsService,
          useValue: mockCarBrandsService,
        },
        {
          provide: AwsS3Service,
          useValue: mockAwsS3Service,
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    repository = module.get<Repository<Car>>(getRepositoryToken(Car));
    carBrandsService = module.get<CarBrandsService>(CarBrandsService);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        engineType: 'เบนซิน',
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

      const userId = 'user-uuid';
      const uploadedImageUrls = ['https://s3.amazonaws.com/car1.jpg'];
      const mockBrand = { id: 'brand-uuid', name: 'Honda' };
      const generatedSlug = 'honda-civic-type-r-2020-12345';

      const createdEntity = {
        ...createDto,
        images: uploadedImageUrls,
        slug: generatedSlug,
        brand: { id: createDto.brandId },
        type: { id: createDto.typeId },
        category: { id: createDto.categoryId },
        createdBy: { id: userId },
      };

      const savedEntity: Car = {
        id: 'car-uuid',
        slug: generatedSlug,
        model: createDto.model,
        subModel: createDto.subModel,
        modelYear: createDto.modelYear,
        transmission: createDto.transmission,
        color: createDto.color,
        engineType: createDto.engineType,
        engineCapacity: createDto.engineCapacity,
        mileage: createDto.mileage,
        price: createDto.price,
        originalLicensePlate: createDto.originalLicensePlate,
        currentLicensePlate: createDto.currentLicensePlate,
        salesType: createDto.salesType,
        isActive: createDto.isActive,
        images: uploadedImageUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockAwsS3Service.uploadFile.mockResolvedValue(uploadedImageUrls[0]);
      mockCarBrandsService.findOne.mockResolvedValue(mockBrand);
      mockGenerateCarSlug.mockReturnValue(generatedSlug);
      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(createDto, files, userId);

      expect(awsS3Service.uploadFile).toHaveBeenCalledWith(files[0], 'cars');
      expect(carBrandsService.findOne).toHaveBeenCalledWith(createDto.brandId);
      expect(mockGenerateCarSlug).toHaveBeenCalledWith(
        mockBrand.name,
        createDto,
      );
      expect(repository.create).toHaveBeenCalledWith(createdEntity);
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(savedEntity);
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
        engineType: 'เบนซิน',
        engineCapacity: 1600,
        mileage: 25000,
        price: 20000,
        originalLicensePlate: 'OLD-123',
        currentLicensePlate: 'NEW-456',
        salesType: SalesRequestType.CONSIGNMENT,
        isActive: true,
      };

      const files: Express.Multer.File[] = [];
      const userId = 'user-uuid';
      const mockBrand = { id: 'brand-uuid', name: 'Honda' };
      const generatedSlug = 'honda-civic-lx-2019-12346';

      const createdEntity = {
        ...createDto,
        images: [],
        slug: generatedSlug,
        brand: { id: createDto.brandId },
        type: { id: createDto.typeId },
        category: { id: createDto.categoryId },
        createdBy: { id: userId },
      };

      const savedEntity: Car = {
        id: 'car-uuid-2',
        slug: generatedSlug,
        model: createDto.model,
        subModel: createDto.subModel,
        modelYear: createDto.modelYear,
        transmission: createDto.transmission,
        color: createDto.color,
        engineType: createDto.engineType,
        engineCapacity: createDto.engineCapacity,
        mileage: createDto.mileage,
        price: createDto.price,
        originalLicensePlate: createDto.originalLicensePlate,
        currentLicensePlate: createDto.currentLicensePlate,
        salesType: createDto.salesType,
        isActive: createDto.isActive,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockCarBrandsService.findOne.mockResolvedValue(mockBrand);
      mockGenerateCarSlug.mockReturnValue(generatedSlug);
      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(createDto, files, userId);

      expect(awsS3Service.uploadFile).not.toHaveBeenCalled();
      expect(carBrandsService.findOne).toHaveBeenCalledWith(createDto.brandId);
      expect(mockGenerateCarSlug).toHaveBeenCalledWith(
        mockBrand.name,
        createDto,
      );
      expect(repository.create).toHaveBeenCalledWith(createdEntity);
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(savedEntity);
    });
  });

  describe('findAllPaginated', () => {
    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return paginated cars with filters', async () => {
      const query: CarListQueryDto = {
        page: 1,
        pageSize: 10,
        brand: 'HONDA',
        type: 'SEDAN',
        model: 'Civic',
        transmission: Transmission.MANUAL,
        minPrice: 15000,
        maxPrice: 30000,
        isActive: true,
      };

      const mockCars: Car[] = [
        {
          id: 'car-uuid',
          slug: 'honda-civic-type-r-2020',
          model: 'Civic',
          subModel: 'Type R',
          modelYear: 2020,
          transmission: Transmission.MANUAL,
          color: 'Red',
          engineType: 'เบนซิน',
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
          brand: { id: 'HONDA', name: 'Honda' } as any,
          type: { id: 'SEDAN', name: 'Sedan' } as any,
          category: { id: 'NEW', name: 'มาใหม่' } as any,
          createdBy: null,
          updatedBy: null,
        },
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockCars, 1]);

      const result = await service.findAllPaginated(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('car');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'car.brand',
        'brand',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'car.type',
        'type',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'car.category',
        'category',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'brand.name = :brand',
        { brand: 'HONDA' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'type.name = :type',
        { type: 'SEDAN' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.model = :model',
        { model: 'Civic' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.transmission = :transmission',
        { transmission: Transmission.MANUAL },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.is_active = :isActive',
        { isActive: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.price >= :minPrice',
        { minPrice: 15000 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.price <= :maxPrice',
        { maxPrice: 30000 },
      );
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();

      expect(result).toBeInstanceOf(PaginationResponseDto);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toBeInstanceOf(CarListResponseDto);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should return paginated cars without filters', async () => {
      const query: CarListQueryDto = {
        page: 2,
        pageSize: 5,
      };

      const mockCars: Car[] = [];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockCars, 0]);

      const result = await service.findAllPaginated(query);

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('car');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5); // (page - 1) * pageSize
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      // Should not call any andWhere for filters
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();

      expect(result).toBeInstanceOf(PaginationResponseDto);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(5);
    });

    it('should handle keyword search', async () => {
      const query: CarListQueryDto = {
        page: 1,
        pageSize: 10,
        keyword: 'civic',
      };

      const mockCars: Car[] = [];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockCars, 0]);

      await service.findAllPaginated(query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(LOWER(car.model) ILIKE :keyword OR LOWER(car.sub_model) ILIKE :keyword)',
        { keyword: '%civic%' },
      );
    });
  });

  describe('findOneById', () => {
    it('should return a car by id', async () => {
      const carId = 'car-uuid';
      const mockCar: Car = {
        id: carId,
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: 'เบนซิน',
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

      mockRepository.findOne.mockResolvedValue(mockCar);

      const result = await service.findOneById(carId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
      });
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException if car not found', async () => {
      const carId = 'non-existent-uuid';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById(carId)).rejects.toThrow(
        new NotFoundException('Car not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
      });
    });
  });

  describe('findOneBySlug', () => {
    it('should return a car by slug', async () => {
      const slug = 'honda-civic-type-r-2020';
      const mockCar: Car = {
        id: 'car-uuid',
        slug,
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: 'เบนซิน',
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
        brand: 'HONDA' as any,
        type: { id: 'SEDAN', name: 'Sedan' } as any,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      mockRepository.findOne.mockResolvedValue(mockCar);

      const result = await service.findOneBySlug(slug);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { slug, isActive: true },
        relations: ['brand', 'type', 'category'],
      });
      expect(result).toEqual({
        ...mockCar,
        transmission: TRANSMISSION_TRANSLATIONS[mockCar.transmission],
      });
    });

    it('should throw NotFoundException if car not found by slug', async () => {
      const slug = 'non-existent-slug';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneBySlug(slug)).rejects.toThrow(
        new NotFoundException('Car not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { slug, isActive: true },
        relations: ['brand', 'type', 'category'],
      });
    });
  });

  describe('update', () => {
    it('should update a car with files', async () => {
      const carId = 'car-uuid';
      const updateDto: UpdateCarDto = {
        model: 'Updated Civic',
        color: 'Black',
        price: 27000,
        brandId: 'brand-uuid',
        typeId: 'type-uuid',
        categoryId: 'category-uuid',
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

      const userId = 'user-uuid';
      const oldImages = ['old-image-url'];
      const newImages = ['new-image-url'];

      const existingCar: Car = {
        id: carId,
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: 'เบนซิน',
        engineCapacity: 2000,
        mileage: 15000,
        price: 25000,
        originalLicensePlate: 'ABC-123',
        currentLicensePlate: 'XYZ-789',
        salesType: SalesRequestType.OWNER,
        isActive: true,
        images: oldImages,
        createdAt: new Date(),
        updatedAt: new Date(),
        brand: null,
        type: null,
        category: null,
        createdBy: null,
        updatedBy: null,
      };

      const mergedCar = {
        ...existingCar,
        ...updateDto,
        brand: { id: updateDto.brandId },
        type: { id: updateDto.typeId },
        category: { id: updateDto.categoryId },
        images: newImages,
      };

      const updatedCar = {
        ...mergedCar,
        updatedBy: { id: userId } as any,
      };

      mockRepository.findOne.mockResolvedValue(existingCar);
      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockAwsS3Service.uploadFile.mockResolvedValue(newImages[0]);
      mockRepository.merge.mockReturnValue(mergedCar);
      mockRepository.save.mockResolvedValue(updatedCar);

      const result = await service.update(carId, updateDto, files, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
      });
      expect(awsS3Service.deleteFile).toHaveBeenCalledWith(oldImages);
      expect(awsS3Service.uploadFile).toHaveBeenCalledWith(files[0], 'cars');
      expect(repository.merge).toHaveBeenCalledWith(existingCar, {
        ...updateDto,
        brand: { id: updateDto.brandId },
        type: { id: updateDto.typeId },
        category: { id: updateDto.categoryId },
        images: newImages,
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mergedCar,
        updatedBy: { id: userId },
      });
      expect(result).toEqual(updatedCar);
    });

    it('should throw NotFoundException if car not found during update', async () => {
      const carId = 'non-existent-uuid';
      const updateDto: UpdateCarDto = { model: 'Updated Model' };
      const files: Express.Multer.File[] = [];
      const userId = 'user-uuid';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(carId, updateDto, files, userId),
      ).rejects.toThrow(new NotFoundException('Car not found'));

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
      });
      expect(awsS3Service.deleteFile).not.toHaveBeenCalled();
      expect(repository.merge).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    it('should activate a car', async () => {
      const carId = 'car-uuid';
      const userId = 'user-uuid';

      const existingCar: Car = {
        id: carId,
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: 'เบนซิน',
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
        updatedBy: null,
      };

      const activatedCar: Car = {
        ...existingCar,
        isActive: true,
        updatedBy: { id: userId } as any,
      };

      mockRepository.findOne.mockResolvedValue(existingCar);
      mockRepository.save.mockResolvedValue(activatedCar);

      const result = await service.activate(carId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingCar,
        isActive: true,
        updatedBy: { id: userId },
      });
      expect(result).toEqual(activatedCar);
    });
  });

  describe('disable', () => {
    it('should disable a car', async () => {
      const carId = 'car-uuid';
      const userId = 'user-uuid';

      const existingCar: Car = {
        id: carId,
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: 'เบนซิน',
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

      const disabledCar: Car = {
        ...existingCar,
        isActive: false,
        updatedBy: { id: userId } as any,
      };

      mockRepository.findOne.mockResolvedValue(existingCar);
      mockRepository.save.mockResolvedValue(disabledCar);

      const result = await service.disable(carId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
        relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingCar,
        isActive: false,
        updatedBy: { id: userId },
      });
      expect(result).toEqual(disabledCar);
    });
  });

  describe('delete', () => {
    it('should delete a car', async () => {
      const carId = 'car-uuid';
      const existingCar: Car = {
        id: carId,
        slug: 'honda-civic-type-r-2020',
        model: 'Civic',
        subModel: 'Type R',
        modelYear: 2020,
        transmission: Transmission.MANUAL,
        color: 'Red',
        engineType: 'เบนซิน',
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

      mockRepository.findOne.mockResolvedValue(existingCar);
      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.delete(carId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
      });
      expect(awsS3Service.deleteFile).toHaveBeenCalledWith(existingCar.images);
      expect(repository.delete).toHaveBeenCalledWith(carId);
    });

    it('should throw NotFoundException if car not found during delete', async () => {
      const carId = 'non-existent-uuid';
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(carId)).rejects.toThrow(
        new NotFoundException('Car not found'),
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: carId },
      });
      expect(awsS3Service.deleteFile).not.toHaveBeenCalled();
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
