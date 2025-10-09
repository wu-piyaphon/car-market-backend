import { Test, TestingModule } from '@nestjs/testing';
import { CarTypesService } from './car-types.service';
import { CarType } from './entities/car-type.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCarTypeDto } from './dtos/create-car-type.dto';
import { UpdateCarTypeDto } from './dtos/update-car-type.dto';

describe('CarTypesService', () => {
  let service: CarTypesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
  };

  const mockAwsS3Service = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'image',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 1024,
    destination: '',
    filename: '',
    path: '',
    stream: null,
  };

  const mockCarType: CarType = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'SUV',
    image: 'https://s3.amazonaws.com/car-types/image.jpg',
    cars: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarTypesService,
        {
          provide: getRepositoryToken(CarType),
          useValue: mockRepository,
        },
        {
          provide: AwsS3Service,
          useValue: mockAwsS3Service,
        },
      ],
    }).compile();

    service = module.get<CarTypesService>(CarTypesService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of car types', async () => {
      const carTypes = [
        mockCarType,
        { ...mockCarType, id: '2', name: 'SEDAN' },
      ];
      mockRepository.find.mockResolvedValue(carTypes);

      const result = await service.findAll();

      expect(result).toEqual(carTypes);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no car types exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a car type by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCarType);

      const result = await service.findOne(mockCarType.id);

      expect(result).toEqual(mockCarType);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCarType.id },
      });
    });

    it('should throw NotFoundException when car type not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Car type not found'),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });
  });

  describe('create', () => {
    const createCarTypeDto: CreateCarTypeDto = {
      id: 'SEDAN',
      name: 'รถเก๋ง',
    };

    it('should create a car type successfully', async () => {
      const imageUrl = 'https://s3.amazonaws.com/car-types/new-image.jpg';
      mockAwsS3Service.uploadFile.mockResolvedValue(imageUrl);
      mockRepository.create.mockReturnValue(mockCarType);
      mockRepository.save.mockResolvedValue(mockCarType);

      const result = await service.create(createCarTypeDto, mockFile);

      expect(result).toEqual(mockCarType);
      expect(mockAwsS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'car-types',
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCarTypeDto,
        image: imageUrl,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarType);
    });

    it('should throw BadRequestException when car type already exists', async () => {
      const imageUrl = 'https://s3.amazonaws.com/car-types/new-image.jpg';
      mockAwsS3Service.uploadFile.mockResolvedValue(imageUrl);
      mockRepository.create.mockReturnValue(mockCarType);
      const duplicateError = new Error('Duplicate entry');
      (duplicateError as any).code = '23505';
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(service.create(createCarTypeDto, mockFile)).rejects.toThrow(
        new BadRequestException('Car type already exists'),
      );

      expect(mockAwsS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'car-types',
      );
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createCarTypeDto,
        image: imageUrl,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarType);
    });

    it('should throw other errors as is', async () => {
      const imageUrl = 'https://s3.amazonaws.com/car-types/new-image.jpg';
      mockAwsS3Service.uploadFile.mockResolvedValue(imageUrl);
      mockRepository.create.mockReturnValue(mockCarType);
      const otherError = new Error('Database connection error');
      mockRepository.save.mockRejectedValue(otherError);

      await expect(service.create(createCarTypeDto, mockFile)).rejects.toThrow(
        otherError,
      );
    });
  });

  describe('update', () => {
    const updateCarTypeDto: UpdateCarTypeDto = {
      name: 'UPDATED_SUV',
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarType);
    });

    it('should update a car type with file', async () => {
      const newImageUrl =
        'https://s3.amazonaws.com/car-types/updated-image.jpg';
      // Create a fresh copy for this test to avoid mutation issues
      const freshMockCarType = { ...mockCarType };
      jest.spyOn(service, 'findOne').mockResolvedValue(freshMockCarType);

      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockAwsS3Service.uploadFile.mockResolvedValue(newImageUrl);
      const updatedCarType = {
        ...mockCarType,
        ...updateCarTypeDto,
        image: newImageUrl,
      };
      mockRepository.save.mockResolvedValue(updatedCarType);

      const result = await service.update(
        mockCarType.id,
        updateCarTypeDto,
        mockFile,
      );

      expect(result).toEqual(updatedCarType);
      expect(service.findOne).toHaveBeenCalledWith(mockCarType.id);
      expect(mockAwsS3Service.deleteFile).toHaveBeenCalledWith(
        mockCarType.image,
      );
      expect(mockAwsS3Service.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'car-types',
      );
      expect(mockRepository.merge).toHaveBeenCalledWith(
        freshMockCarType,
        updateCarTypeDto,
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update a car type without file', async () => {
      const updatedCarType = { ...mockCarType, ...updateCarTypeDto };
      mockRepository.save.mockResolvedValue(updatedCarType);

      const result = await service.update(
        mockCarType.id,
        updateCarTypeDto,
        null,
      );

      expect(result).toEqual(updatedCarType);
      expect(service.findOne).toHaveBeenCalledWith(mockCarType.id);
      expect(mockAwsS3Service.deleteFile).not.toHaveBeenCalled();
      expect(mockAwsS3Service.uploadFile).not.toHaveBeenCalled();
      expect(mockRepository.merge).toHaveBeenCalledWith(
        mockCarType,
        updateCarTypeDto,
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when car type not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Car type not found'));

      await expect(
        service.update('nonexistent-id', updateCarTypeDto, mockFile),
      ).rejects.toThrow(new NotFoundException('Car type not found'));
    });

    it('should throw BadRequestException when duplicate name during update', async () => {
      const newImageUrl =
        'https://s3.amazonaws.com/car-types/updated-image.jpg';
      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockAwsS3Service.uploadFile.mockResolvedValue(newImageUrl);
      const duplicateError = new Error('Duplicate entry');
      (duplicateError as any).code = '23505';
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(
        service.update(mockCarType.id, updateCarTypeDto, mockFile),
      ).rejects.toThrow(new BadRequestException('Car type already exists'));
    });

    it('should throw other errors as is during update', async () => {
      const otherError = new Error('Database connection error');
      mockRepository.save.mockRejectedValue(otherError);

      await expect(
        service.update(mockCarType.id, updateCarTypeDto, null),
      ).rejects.toThrow(otherError);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarType);
    });

    it('should remove a car type successfully', async () => {
      mockAwsS3Service.deleteFile.mockResolvedValue(undefined);
      mockRepository.softRemove.mockResolvedValue(mockCarType);

      await service.remove(mockCarType.id);

      expect(service.findOne).toHaveBeenCalledWith(mockCarType.id);
      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockCarType);
    });

    it('should throw NotFoundException when car type not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Car type not found'));

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Car type not found'),
      );

      expect(mockAwsS3Service.deleteFile).not.toHaveBeenCalled();
      expect(mockRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
