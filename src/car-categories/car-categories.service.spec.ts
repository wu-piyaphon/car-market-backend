import { Test, TestingModule } from '@nestjs/testing';
import { CarCategoriesService } from './car-categories.service';
import { CarCategory } from './entities/car-category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCarCategoryDto } from './dtos/create-car-category.dto';
import { UpdateCarCategoryDto } from './dtos/update-car-category.dto';

describe('CarCategoriesService', () => {
  let service: CarCategoriesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockCarCategory: CarCategory = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'SEDAN',
    cars: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarCategoriesService,
        {
          provide: getRepositoryToken(CarCategory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CarCategoriesService>(CarCategoriesService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of car categories', async () => {
      const carCategories = [
        mockCarCategory,
        { ...mockCarCategory, id: '2', name: 'SUV' },
      ];
      mockRepository.find.mockResolvedValue(carCategories);

      const result = await service.findAll();

      expect(result).toEqual(carCategories);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no car categories exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a car category by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCarCategory);

      const result = await service.findOne(mockCarCategory.id);

      expect(result).toEqual(mockCarCategory);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockCarCategory.id },
      });
    });

    it('should throw NotFoundException when car category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Car category not found'),
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'nonexistent-id' },
      });
    });
  });

  describe('create', () => {
    const createCarCategoryDto: CreateCarCategoryDto = {
      id: 'HATCHBACK',
      name: 'HATCHBACK',
    };

    it('should create a car category successfully', async () => {
      mockRepository.create.mockReturnValue(mockCarCategory);
      mockRepository.save.mockResolvedValue(mockCarCategory);

      const result = await service.create(createCarCategoryDto);

      expect(result).toEqual(mockCarCategory);
      expect(mockRepository.create).toHaveBeenCalledWith(createCarCategoryDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarCategory);
    });

    it('should throw BadRequestException when car category already exists', async () => {
      mockRepository.create.mockReturnValue(mockCarCategory);
      const duplicateError = new Error('Duplicate entry');
      (duplicateError as any).code = '23505';
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(service.create(createCarCategoryDto)).rejects.toThrow(
        new BadRequestException('Car category already exists'),
      );

      expect(mockRepository.create).toHaveBeenCalledWith(createCarCategoryDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarCategory);
    });

    it('should throw other errors as is', async () => {
      mockRepository.create.mockReturnValue(mockCarCategory);
      const otherError = new Error('Database connection error');
      mockRepository.save.mockRejectedValue(otherError);

      await expect(service.create(createCarCategoryDto)).rejects.toThrow(
        otherError,
      );
    });
  });

  describe('update', () => {
    const updateCarCategoryDto: UpdateCarCategoryDto = {
      name: 'UPDATED_SEDAN',
    };

    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarCategory);
    });

    it('should update a car category successfully', async () => {
      const updatedCarCategory = {
        ...mockCarCategory,
        ...updateCarCategoryDto,
      };
      mockRepository.save.mockResolvedValue(updatedCarCategory);

      const result = await service.update(
        mockCarCategory.id,
        updateCarCategoryDto,
      );

      expect(result).toEqual(updatedCarCategory);
      expect(service.findOne).toHaveBeenCalledWith(mockCarCategory.id);
      expect(mockRepository.merge).toHaveBeenCalledWith(
        mockCarCategory,
        updateCarCategoryDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockCarCategory);
    });

    it('should throw NotFoundException when car category not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Car category not found'));

      await expect(
        service.update('nonexistent-id', updateCarCategoryDto),
      ).rejects.toThrow(new NotFoundException('Car category not found'));
    });

    it('should throw BadRequestException when duplicate name during update', async () => {
      const duplicateError = new Error('Duplicate entry');
      (duplicateError as any).code = '23505';
      mockRepository.save.mockRejectedValue(duplicateError);

      await expect(
        service.update(mockCarCategory.id, updateCarCategoryDto),
      ).rejects.toThrow(new BadRequestException('Car category already exists'));
    });

    it('should throw other errors as is during update', async () => {
      const otherError = new Error('Database connection error');
      mockRepository.save.mockRejectedValue(otherError);

      await expect(
        service.update(mockCarCategory.id, updateCarCategoryDto),
      ).rejects.toThrow(otherError);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCarCategory);
    });

    it('should remove a car category successfully', async () => {
      mockRepository.remove.mockResolvedValue(mockCarCategory);

      await service.remove(mockCarCategory.id);

      expect(service.findOne).toHaveBeenCalledWith(mockCarCategory.id);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCarCategory);
    });

    it('should throw NotFoundException when car category not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Car category not found'));

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Car category not found'),
      );

      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
