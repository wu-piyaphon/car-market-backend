import { Test, TestingModule } from '@nestjs/testing';
import { CarBrandsService } from './car-brands.service';
import { CarBrand } from './entities/car-brand.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCarBrandDto } from './dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from './dtos/update-car-brand.dto';
import { IsNull } from 'typeorm';

describe('CarBrandsService', () => {
  let service: CarBrandsService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockAwsS3Service = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'toyota-logo.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 1024,
    destination: '',
    filename: '',
    path: '',
    stream: null,
  };

  const mockCarBrand: CarBrand = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Toyota',
    image: 'https://s3.amazonaws.com/car-brands/toyota-logo.jpg',
    cars: [],
    estimateRequests: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarBrandsService,
        {
          provide: getRepositoryToken(CarBrand),
          useValue: mockRepository,
        },
        {
          provide: AwsS3Service,
          useValue: mockAwsS3Service,
        },
      ],
    }).compile();

    service = module.get<CarBrandsService>(CarBrandsService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of car brands', async () => {
      const carBrands = [
        mockCarBrand,
        { ...mockCarBrand, id: '2', name: 'Honda' },
      ];
      mockRepository.find.mockResolvedValue(carBrands);

      const result = await service.findAll();

      expect(result).toEqual(carBrands);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no car brands exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a car brand by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCarBrand);

      const result = await service.findOne(mockCarBrand.id);

      expect(result).toEqual(mockCarBrand);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCarBrand.id, deletedAt: IsNull() },
      });
    });

    it('should throw NotFoundException when car brand not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Car brand not found'),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id', deletedAt: IsNull() },
      });
    });
  });

  describe('create', () => {
    const createCarBrandDto: CreateCarBrandDto = {
      id: 'NISSAN',
      name: 'นิซซัน',
    };

    it('should create a car brand successfully', async () => {
      const imageUrl = 'https://s3.amazonaws.com/car-brands/nissan-logo.jpg';
      mockAwsS3Service.uploadFile.mockResolvedValue(imageUrl);
      mockRepository.create.mockReturnValue(mockCarBrand);
      mockRepository.save.mockResolvedValue(mockCarBrand);

      const result = await service.create(createCarBrandDto, mockFile);

      expect(result).toEqual(mockCarBrand);
      expect(mockAwsS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'car-brands',
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCarBrandDto,
        image: imageUrl,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarBrand);
    });

    it('should throw BadRequestException when car brand already exists', async () => {
      const imageUrl = 'https://s3.amazonaws.com/car-brands/nissan-logo.jpg';
      mockAwsS3Service.uploadFile.mockResolvedValue(imageUrl);
      mockRepository.create.mockReturnValue(mockCarBrand);
      const duplicateError = new Error('Duplicate entry');
      (duplicateError as any).code = '23505';
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(service.create(createCarBrandDto, mockFile)).rejects.toThrow(
        new BadRequestException('Car brand already exists'),
      );

      expect(mockAwsS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'car-brands',
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCarBrandDto,
        image: imageUrl,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarBrand);
    });

    it('should throw other errors as is', async () => {
      const imageUrl = 'https://s3.amazonaws.com/car-brands/nissan-logo.jpg';
      mockAwsS3Service.uploadFile.mockResolvedValue(imageUrl);
      mockRepository.create.mockReturnValue(mockCarBrand);
      const otherError = new Error('Database connection error');
      mockRepository.save.mockRejectedValue(otherError);

      await expect(service.create(createCarBrandDto, mockFile)).rejects.toThrow(
        otherError,
      );
    });
  });

  describe('update', () => {
    const updateCarBrandDto: UpdateCarBrandDto = {
      name: 'Updated Toyota',
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarBrand);
    });

    it('should update a car brand with file', async () => {
      const newImageUrl =
        'https://s3.amazonaws.com/car-brands/updated-toyota-logo.jpg';
      // Create a fresh copy for this test to avoid mutation issues
      const freshMockCarBrand = { ...mockCarBrand };
      jest.spyOn(service, 'findOne').mockResolvedValue(freshMockCarBrand);

      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockAwsS3Service.uploadFile.mockResolvedValue(newImageUrl);
      const updatedCarBrand = {
        ...mockCarBrand,
        ...updateCarBrandDto,
        image: newImageUrl,
      };
      mockRepository.save.mockResolvedValue(updatedCarBrand);

      const result = await service.update(
        mockCarBrand.id,
        updateCarBrandDto,
        mockFile,
      );

      expect(result).toEqual(updatedCarBrand);
      expect(service.findOne).toHaveBeenCalledWith(mockCarBrand.id);
      expect(mockAwsS3Service.deleteFile).toHaveBeenCalledWith(
        mockCarBrand.image,
      );
      expect(mockAwsS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'car-brands',
      );
      expect(mockRepository.merge).toHaveBeenCalledWith(
        freshMockCarBrand,
        updateCarBrandDto,
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update a car brand without file', async () => {
      const updatedCarBrand = { ...mockCarBrand, ...updateCarBrandDto };
      mockRepository.save.mockResolvedValue(updatedCarBrand);

      const result = await service.update(
        mockCarBrand.id,
        updateCarBrandDto,
        null,
      );

      expect(result).toEqual(updatedCarBrand);
      expect(service.findOne).toHaveBeenCalledWith(mockCarBrand.id);
      expect(mockAwsS3Service.deleteFile).not.toHaveBeenCalled();
      expect(mockAwsS3Service.uploadFile).not.toHaveBeenCalled();
      expect(mockRepository.merge).toHaveBeenCalledWith(
        mockCarBrand,
        updateCarBrandDto,
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when car brand not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Car brand not found'));

      await expect(
        service.update('nonexistent-id', updateCarBrandDto, mockFile),
      ).rejects.toThrow(new NotFoundException('Car brand not found'));
    });

    it('should throw BadRequestException when duplicate name during update', async () => {
      const newImageUrl =
        'https://s3.amazonaws.com/car-brands/updated-toyota-logo.jpg';
      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockAwsS3Service.uploadFile.mockResolvedValue(newImageUrl);
      const duplicateError = new Error('Duplicate entry');
      (duplicateError as any).code = '23505';
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(
        service.update(mockCarBrand.id, updateCarBrandDto, mockFile),
      ).rejects.toThrow(new BadRequestException('Car brand already exists'));
    });

    it('should throw other errors as is during update', async () => {
      const otherError = new Error('Database connection error');
      mockRepository.save.mockRejectedValue(otherError);

      await expect(
        service.update(mockCarBrand.id, updateCarBrandDto, null),
      ).rejects.toThrow(otherError);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarBrand);
    });

    it('should remove a car brand successfully', async () => {
      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockRepository.softRemove.mockResolvedValue(mockCarBrand);

      await service.remove(mockCarBrand.id);

      expect(service.findOne).toHaveBeenCalledWith(mockCarBrand.id);
      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockCarBrand);
    });

    it('should throw NotFoundException when car brand not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Car brand not found'));

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Car brand not found'),
      );

      expect(mockAwsS3Service.deleteFile).not.toHaveBeenCalled();
      expect(mockRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
