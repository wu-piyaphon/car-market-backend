import { Test, TestingModule } from '@nestjs/testing';
import { CarFilterController } from './car-filter.controller';
import { CarFilterService } from './car-filter.service';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';
import { CarFilterResponseDto } from '../dtos/car-filter-response.dto';
import { EngineType } from '@/common/enums/engine-type.enum';
import { Transmission } from '@/common/enums/transmission.enum';

describe('CarFilterController', () => {
  let controller: CarFilterController;
  let service: CarFilterService;

  const mockCarFilterService = {
    getFilters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarFilterController],
      providers: [
        {
          provide: CarFilterService,
          useValue: mockCarFilterService,
        },
      ],
    }).compile();

    controller = module.get<CarFilterController>(CarFilterController);
    service = module.get<CarFilterService>(CarFilterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilters', () => {
    it('should return filter options with empty query', async () => {
      const query: CarFilterQueryDto = {};
      const expectedResult: CarFilterResponseDto = {
        brands: [
          { name: 'Toyota', count: 5, image: 'toyota-image-url' },
          { name: 'Honda', count: 3, image: 'honda-image-url' },
        ],
        types: [
          { name: 'SUV', count: 4, image: 'suv-image-url' },
          { name: 'SEDAN', count: 3, image: 'sedan-image-url' },
        ],
        categories: [
          { name: 'NEW', count: 2 },
          { name: 'USED', count: 5 },
        ],
        models: [
          { name: 'Corolla', count: 3 },
          { name: 'Civic', count: 2 },
        ],
        subModels: [
          { name: 'Altis', count: 1 },
          { name: 'Grande', count: 2 },
        ],
        modelYears: [
          { name: '2020', count: 2 },
          { name: '2021', count: 3 },
        ],
        transmissions: [
          { name: Transmission.AUTOMATIC, count: 4 },
          { name: Transmission.MANUAL, count: 3 },
        ],
        colors: [
          { name: 'red', count: 2 },
          { name: 'blue', count: 3 },
        ],
        engineTypes: [
          { name: EngineType.HYBRID, count: 1 },
          { name: EngineType.GASOLINE, count: 6 },
        ],
      };

      mockCarFilterService.getFilters.mockResolvedValue(expectedResult);

      const result = await controller.getFilters(query);

      expect(result).toBe(expectedResult);
      expect(service.getFilters).toHaveBeenCalledTimes(1);
      expect(service.getFilters).toHaveBeenCalledWith(query);
    });

    it('should return filter options with specific query filters', async () => {
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
      const expectedResult: CarFilterResponseDto = {
        brands: [{ name: 'Toyota', count: 2, image: 'toyota-image-url' }],
        types: [{ name: 'SUV', count: 2, image: 'suv-image-url' }],
        categories: [{ name: 'NEW', count: 2 }],
        models: [{ name: 'Corolla', count: 2 }],
        subModels: [{ name: 'Altis', count: 2 }],
        modelYears: [{ name: '2020', count: 2 }],
        transmissions: [{ name: Transmission.AUTOMATIC, count: 2 }],
        colors: [{ name: 'red', count: 2 }],
        engineTypes: [{ name: EngineType.HYBRID, count: 2 }],
      };

      mockCarFilterService.getFilters.mockResolvedValue(expectedResult);

      const result = await controller.getFilters(query);

      expect(result).toBe(expectedResult);
      expect(service.getFilters).toHaveBeenCalledTimes(1);
      expect(service.getFilters).toHaveBeenCalledWith(query);
    });

    it('should return empty filter options when no cars match', async () => {
      const query: CarFilterQueryDto = {
        brand: 'NonExistentBrand',
      };
      const expectedResult: CarFilterResponseDto = {
        brands: [],
        types: [],
        categories: [],
        models: [],
        subModels: [],
        modelYears: [],
        transmissions: [],
        colors: [],
        engineTypes: [],
      };

      mockCarFilterService.getFilters.mockResolvedValue(expectedResult);

      const result = await controller.getFilters(query);

      expect(result).toBe(expectedResult);
      expect(service.getFilters).toHaveBeenCalledTimes(1);
      expect(service.getFilters).toHaveBeenCalledWith(query);
    });

    it('should handle partial query filters', async () => {
      const query: CarFilterQueryDto = {
        brand: 'Toyota',
        transmission: Transmission.MANUAL,
      };
      const expectedResult: CarFilterResponseDto = {
        brands: [{ name: 'Toyota', count: 1, image: 'toyota-image-url' }],
        types: [{ name: 'SEDAN', count: 1, image: 'sedan-image-url' }],
        categories: [{ name: 'USED', count: 1 }],
        models: [{ name: 'Camry', count: 1 }],
        subModels: [{ name: 'Grande', count: 1 }],
        modelYears: [{ name: '2019', count: 1 }],
        transmissions: [{ name: Transmission.MANUAL, count: 1 }],
        colors: [{ name: 'white', count: 1 }],
        engineTypes: [{ name: EngineType.GASOLINE, count: 1 }],
      };

      mockCarFilterService.getFilters.mockResolvedValue(expectedResult);

      const result = await controller.getFilters(query);

      expect(result).toBe(expectedResult);
      expect(service.getFilters).toHaveBeenCalledTimes(1);
      expect(service.getFilters).toHaveBeenCalledWith(query);
    });
  });
});
