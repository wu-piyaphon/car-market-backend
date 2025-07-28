import { EngineType } from '@/common/enums/engine-type.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';
import { Car } from '../entities/car.entity';
import { CarFilterService } from './car-filter.service';

describe('CarFilterService', () => {
  let service: CarFilterService;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarFilterService,
        {
          provide: getRepositoryToken(Car),
          useValue: {
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<CarFilterService>(CarFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return filter options with counts and return empty array if filter value is null', async () => {
    // Arrange
    mockQueryBuilder.getRawMany
      .mockResolvedValueOnce([
        { value: 'Toyota', count: 5, image: 'url' },
        { value: 'Honda', count: 3, image: 'url' },
      ]) // brands
      .mockResolvedValueOnce([{ value: 'SUV', count: 4, image: 'url' }]) // types
      .mockResolvedValueOnce([{ value: null, count: 2 }]) // categories
      .mockResolvedValueOnce([{ value: 'Corolla', count: 3 }]) // models
      .mockResolvedValueOnce([{ value: 'Altis', count: 1 }]) // subModels
      .mockResolvedValueOnce([{ value: 2020, count: 2 }]) // modelYears
      .mockResolvedValueOnce([{ value: Transmission.AUTOMATIC, count: 4 }]) // transmissions
      .mockResolvedValueOnce([{ value: 'red', count: 2 }]) // colors
      .mockResolvedValueOnce([{ value: EngineType.HYBRID, count: 1 }]); // engineTypes

    const query: CarFilterQueryDto = {};

    // Act
    const result = await service.getFilters(query);

    // Assert
    expect(result).toEqual({
      brands: [
        { name: 'Toyota', count: 5, image: 'url' },
        { name: 'Honda', count: 3, image: 'url' },
      ],
      types: [{ name: 'SUV', count: 4, image: 'url' }],
      categories: [],
      models: [{ name: 'Corolla', count: 3 }],
      subModels: [{ name: 'Altis', count: 1 }],
      modelYears: [{ name: '2020', count: 2 }],
      transmissions: [{ name: Transmission.AUTOMATIC, count: 4 }],
      colors: [{ name: 'red', count: 2 }],
      engineTypes: [{ name: EngineType.HYBRID, count: 1 }],
    });
    // Check that leftJoin and groupBy were called
    expect(mockQueryBuilder.leftJoin).toHaveBeenCalled();
    expect(mockQueryBuilder.groupBy).toHaveBeenCalledWith('value');
    expect(mockQueryBuilder.addGroupBy).toHaveBeenCalledWith('brand.image');
    expect(mockQueryBuilder.addGroupBy).toHaveBeenCalledWith('type.image');
    expect(mockQueryBuilder.select).toHaveBeenCalled();
  });

  it('should apply filters from query', async () => {
    mockQueryBuilder.getRawMany.mockResolvedValue([]);
    const query: CarFilterQueryDto = {
      brand: 'Toyota',
      type: 'SUV',
      category: 'NEW',
      model: 'Corolla',
      subModel: 'Altis',
      transmission: Transmission.AUTOMATIC,
      color: 'red',
      modelYear: 2020,
      engineType: EngineType.HYBRID,
      engineCapacity: 1800,
    };
    await service.getFilters(query);
    // Should call andWhere for each filter
    expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    // Should call with correct filter values
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'type.name = :type',
      { type: 'SUV' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'brand.name = :brand',
      { brand: 'Toyota' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'category.name = :category',
      { category: 'NEW' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.model = :model',
      { model: 'Corolla' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.subModel = :subModel',
      { subModel: 'Altis' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.transmission = :transmission',
      { transmission: Transmission.AUTOMATIC },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.color = :color',
      { color: 'red' },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.modelYear = :modelYear',
      { modelYear: 2020 },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.engineType = :engineType',
      { engineType: EngineType.HYBRID },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'car.engineCapacity = :engineCapacity',
      { engineCapacity: 1800 },
    );
  });

  it('should return empty arrays if no results', async () => {
    mockQueryBuilder.getRawMany.mockResolvedValue([]);
    const result = await service.getFilters({});
    expect(result).toEqual({
      brands: [],
      types: [],
      categories: [],
      models: [],
      subModels: [],
      modelYears: [],
      transmissions: [],
      colors: [],
      engineTypes: [],
    });
  });
});
