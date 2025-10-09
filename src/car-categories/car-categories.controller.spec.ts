import { Test, TestingModule } from '@nestjs/testing';
import { CarCategoriesController } from './car-categories.controller';
import { CarCategoriesService } from './car-categories.service';
import { CreateCarCategoryDto } from './dtos/create-car-category.dto';
import { UpdateCarCategoryDto } from './dtos/update-car-category.dto';
import { CarCategory } from './entities/car-category.entity';

describe('CarCategoriesController', () => {
  let controller: CarCategoriesController;
  let service: CarCategoriesService;

  const mockCarCategoriesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarCategoriesController],
      providers: [
        {
          provide: CarCategoriesService,
          useValue: mockCarCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CarCategoriesController>(CarCategoriesController);
    service = module.get<CarCategoriesService>(CarCategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of car categories', async () => {
      const expectedResult: CarCategory[] = [
        {
          id: 'category-uuid-1',
          name: 'SEDAN',
          cars: [],
        },
        {
          id: 'category-uuid-2',
          name: 'SUV',
          cars: [],
        },
      ];

      mockCarCategoriesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('should return empty array when no car categories exist', async () => {
      const expectedResult: CarCategory[] = [];

      mockCarCategoriesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a car category by id', async () => {
      const carCategoryId = 'category-uuid-1';
      const expectedResult: CarCategory = {
        id: carCategoryId,
        name: 'SEDAN',
        cars: [],
      };

      mockCarCategoriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(carCategoryId);

      expect(result).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(carCategoryId);
    });

    it('should return a different car category by different id', async () => {
      const carCategoryId = 'category-uuid-2';
      const expectedResult: CarCategory = {
        id: carCategoryId,
        name: 'SUV',
        cars: [],
      };

      mockCarCategoriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(carCategoryId);

      expect(result).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(carCategoryId);
    });
  });

  describe('create', () => {
    it('should create a car category', async () => {
      const createCarCategoryDto: CreateCarCategoryDto = {
        id: 'HATCHBACK',
        name: 'HATCHBACK',
      };
      const expectedResult: CarCategory = {
        id: 'new-category-uuid',
        name: 'HATCHBACK',
        cars: [],
      };

      mockCarCategoriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCarCategoryDto);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createCarCategoryDto);
    });

    it('should create a car category with different name', async () => {
      const createCarCategoryDto: CreateCarCategoryDto = {
        id: 'COUPE',
        name: 'COUPE',
      };
      const expectedResult: CarCategory = {
        id: 'another-category-uuid',
        name: 'COUPE',
        cars: [],
      };

      mockCarCategoriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createCarCategoryDto);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createCarCategoryDto);
    });
  });

  describe('update', () => {
    it('should update a car category', async () => {
      const carCategoryId = 'category-uuid-1';
      const updateCarCategoryDto: UpdateCarCategoryDto = {
        name: 'UPDATED_SEDAN',
      };
      const expectedResult: CarCategory = {
        id: carCategoryId,
        name: 'UPDATED_SEDAN',
        cars: [],
      };

      mockCarCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        carCategoryId,
        updateCarCategoryDto,
      );

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        carCategoryId,
        updateCarCategoryDto,
      );
    });

    it('should update only specific fields', async () => {
      const carCategoryId = 'category-uuid-2';
      const updateCarCategoryDto: UpdateCarCategoryDto = {
        name: 'LUXURY_SUV',
      };
      const expectedResult: CarCategory = {
        id: carCategoryId,
        name: 'LUXURY_SUV',
        cars: [],
      };

      mockCarCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        carCategoryId,
        updateCarCategoryDto,
      );

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(
        carCategoryId,
        updateCarCategoryDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a car category', async () => {
      const carCategoryId = 'category-uuid-1';

      mockCarCategoriesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(carCategoryId);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(carCategoryId);
    });

    it('should remove a different car category', async () => {
      const carCategoryId = 'category-uuid-2';

      mockCarCategoriesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(carCategoryId);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(carCategoryId);
    });
  });
});
