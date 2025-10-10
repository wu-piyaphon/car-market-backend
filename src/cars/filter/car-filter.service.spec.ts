import { ENGINE_TYPE_TRANSLATIONS } from '@/common/constants/translation.constants';
import { EngineType } from '@/common/enums/engine-type.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';
import { CarFilterResponseDto } from '../dtos/car-filter-response.dto';
import { Car } from '../entities/car.entity';
import { CarFilterService } from './car-filter.service';

describe('CarFilterService', () => {
  let service: CarFilterService;
  let mockQueryBuilder: any;

  const mockRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarFilterService,
        {
          provide: getRepositoryToken(Car),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CarFilterService>(CarFilterService);

    // Reset mocks
    jest.clearAllMocks();
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilters', () => {
    it('should return filter options with counts', async () => {
      // Arrange
      const mockData = [
        [
          { value: 'Toyota', count: 5, image: 'toyota-url' },
          { value: 'Honda', count: 3, image: 'honda-url' },
        ], // brands
        [{ value: 'SUV', count: 4, image: 'suv-url' }], // types
        [
          { value: 'NEW', count: 2 },
          { value: 'USED', count: 5 },
        ], // categories
        [{ value: 'Corolla', count: 3 }], // models
        [{ value: 'Altis', count: 1 }], // subModels
        [{ value: 2020, count: 2 }], // modelYears
        [{ value: Transmission.AUTOMATIC, count: 4 }], // transmissions
        [{ value: 'red', count: 2 }], // colors
        [{ value: EngineType.HYBRID, count: 1 }], // engineTypes
        [{ value: 500, count: 0 }], // engineCapacities
      ];

      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce(mockData[0])
        .mockResolvedValueOnce(mockData[1])
        .mockResolvedValueOnce(mockData[2])
        .mockResolvedValueOnce(mockData[3])
        .mockResolvedValueOnce(mockData[4])
        .mockResolvedValueOnce(mockData[5])
        .mockResolvedValueOnce(mockData[6])
        .mockResolvedValueOnce(mockData[7])
        .mockResolvedValueOnce(mockData[8])
        .mockResolvedValueOnce(mockData[9]);

      const query: CarFilterQueryDto = {};

      // Act
      const result = await service.getFilters(query);

      // Assert
      const expectedResult: CarFilterResponseDto = {
        brands: [
          { id: 'Toyota', name: 'Toyota', count: 5, image: 'toyota-url' },
          { id: 'Honda', name: 'Honda', count: 3, image: 'honda-url' },
        ],
        types: [{ id: 'SUV', name: 'SUV', count: 4, image: 'suv-url' }],
        categories: [
          { id: 'NEW', name: 'NEW', count: 2 },
          { id: 'USED', name: 'USED', count: 5 },
        ],
        models: [{ id: 'Corolla', name: 'Corolla', count: 3 }],
        subModels: [{ id: 'Altis', name: 'Altis', count: 1 }],
        modelYears: [{ id: '2020', name: '2020', count: 2 }],
        transmissions: [
          {
            id: Transmission.AUTOMATIC,
            name: 'เกียร์อัตโนมัติ',
            count: 4,
          },
        ],
        colors: [{ id: 'red', name: 'red', count: 2 }],
        engineTypes: [
          {
            id: EngineType.HYBRID,
            name: ENGINE_TYPE_TRANSLATIONS[EngineType.HYBRID],
            count: 1,
          },
        ],
        engineCapacities: [{ id: '500', name: '500 CC', count: 0 }],
      };

      expect(result).toEqual(expectedResult);

      // Verify query builder was called correct number of times (10 times for 10 filters)
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledTimes(10);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'car.brand',
        'brand',
      );
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'car.type',
        'type',
      );
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith(
        'car.category',
        'category',
      );
      expect(mockQueryBuilder.groupBy).toHaveBeenCalled();
      expect(mockQueryBuilder.select).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalledTimes(10);
    });

    it('should return empty array if filter value is null', async () => {
      // Arrange
      const mockData = [
        [], // brands
        [], // types
        [{ value: null, count: 2 }], // categories with null value
        [], // models
        [], // subModels
        [], // modelYears
        [], // transmissions
        [], // colors
        [], // engineTypes
        [], // engineCapacities
      ];

      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce(mockData[0])
        .mockResolvedValueOnce(mockData[1])
        .mockResolvedValueOnce(mockData[2])
        .mockResolvedValueOnce(mockData[3])
        .mockResolvedValueOnce(mockData[4])
        .mockResolvedValueOnce(mockData[5])
        .mockResolvedValueOnce(mockData[6])
        .mockResolvedValueOnce(mockData[7])
        .mockResolvedValueOnce(mockData[8])
        .mockResolvedValueOnce(mockData[9]);

      const query: CarFilterQueryDto = {};

      // Act
      const result = await service.getFilters(query);

      // Assert
      expect(result).toEqual({
        brands: [],
        types: [],
        categories: [], // null values should be filtered out
        models: [],
        subModels: [],
        modelYears: [],
        transmissions: [],
        colors: [],
        engineTypes: [],
        engineCapacities: [],
      });
    });

    it('should apply filters from query and exclude self-filtering', async () => {
      // Arrange
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      const query: CarFilterQueryDto = {
        brand: 'TOYOTA',
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

      // Act
      await service.getFilters(query);

      // Assert - Check that andWhere was called for filtering
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();

      // Verify that filters are applied correctly
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'type.id = :type',
        { type: 'SUV' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'brand.id = :brand',
        { brand: 'TOYOTA' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.id = :category',
        { category: 'NEW' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.model = :model',
        { model: 'Corolla' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.sub_model = :subModel',
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
        'car.model_year = :modelYear',
        { modelYear: 2020 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.engine_type = :engineType',
        { engineType: EngineType.HYBRID },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.engine_capacity = :engineCapacity',
        { engineCapacity: 1800 },
      );
    });

    it('should not apply filter for empty or undefined values', async () => {
      // Arrange
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      const query: CarFilterQueryDto = {
        brand: '', // empty string
        type: undefined, // undefined
        category: 'NEW', // valid value
      };

      // Act
      await service.getFilters(query);

      // Assert - Only category filter should be applied
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'category.id = :category',
        { category: 'NEW' },
      );

      // Brand and type filters should not be applied due to empty/undefined values
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'brand.id = :brand',
        { brand: '' },
      );
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'type.id = :type',
        { type: undefined },
      );
    });

    it('should return empty arrays if no results', async () => {
      // Arrange
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      // Act
      const result = await service.getFilters({});

      // Assert
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
        engineCapacities: [],
      });
    });

    it('should handle mixed data types in results', async () => {
      // Arrange
      const mockData = [
        [{ value: 'TOYOTA', name: 'Toyota', count: '5', image: 'toyota-url' }], // brands - count as string
        [{ value: 'SUV', name: 'รถ SUV', count: 4.5, image: 'suv-url' }], // types - count as float
        [{ value: 123, count: 2 }], // categories - value as number
        [], // models
        [], // subModels
        [{ value: 2020, count: 2 }], // modelYears
        [], // transmissions
        [], // colors
        [], // engineTypes
        [], // engineCapacities
      ];

      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce(mockData[0])
        .mockResolvedValueOnce(mockData[1])
        .mockResolvedValueOnce(mockData[2])
        .mockResolvedValueOnce(mockData[3])
        .mockResolvedValueOnce(mockData[4])
        .mockResolvedValueOnce(mockData[5])
        .mockResolvedValueOnce(mockData[6])
        .mockResolvedValueOnce(mockData[7])
        .mockResolvedValueOnce(mockData[8])
        .mockResolvedValueOnce(mockData[9]);

      // Act
      const result = await service.getFilters({});

      // Assert - Values should be converted to strings, counts to numbers
      expect(result.brands).toEqual([
        { id: 'TOYOTA', name: 'Toyota', count: 5, image: 'toyota-url' },
      ]);
      expect(result.types).toEqual([
        { id: 'SUV', name: 'รถ SUV', count: 4.5, image: 'suv-url' },
      ]);
      expect(result.categories).toEqual([{ id: '123', name: '123', count: 2 }]);
    });

    it('should handle image columns correctly', async () => {
      // Arrange
      const mockData = [
        [
          {
            id: 'TOYOTA',
            value: 'Toyota',
            count: 5,
            image: 'toyota-image-url',
          },
        ], // brands with image
        [{ id: 'SUV', value: 'SUV', count: 4, image: 'suv-image-url' }], // types with image
        [{ id: 'NEW', value: 'NEW', count: 2 }], // categories without image
        [],
        [],
        [],
        [],
        [],
        [],
      ];

      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce(mockData[0])
        .mockResolvedValueOnce(mockData[1])
        .mockResolvedValueOnce(mockData[2])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      // Act
      const result = await service.getFilters({});

      // Assert
      expect(result.brands[0]).toHaveProperty('image', 'toyota-image-url');
      expect(result.types[0]).toHaveProperty('image', 'suv-image-url');
      expect(result.categories[0]).not.toHaveProperty('image');
    });
  });
});
