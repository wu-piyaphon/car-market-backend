import { Test, TestingModule } from '@nestjs/testing';
import { CarFilterController } from './car-filter.controller';
import { CarFilterService } from './car-filter.service';
import { CarFilterQueryDto } from '../dtos/car-filter-query.dto';
import { CarFilterResponseDto } from '../dtos/car-filter-response.dto';
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
          { id: 'Toyota', name: 'Toyota', count: 5, image: 'toyota-image-url' },
          { id: 'Honda', name: 'Honda', count: 3, image: 'honda-image-url' },
        ],
        types: [
          { id: 'SUV', name: 'SUV', count: 4, image: 'suv-image-url' },
          { id: 'SEDAN', name: 'SEDAN', count: 3, image: 'sedan-image-url' },
        ],
        categories: [
          { id: 'NEW', name: 'NEW', count: 2 },
          { id: 'USED', name: 'USED', count: 5 },
        ],
        models: [
          { id: 'Corolla', name: 'Corolla', count: 3 },
          { id: 'Civic', name: 'Civic', count: 2 },
        ],
        subModels: [
          { id: 'Altis', name: 'Altis', count: 1 },
          { id: 'Grande', name: 'Grande', count: 2 },
        ],
        modelYears: [
          { id: '2020', name: '2020', count: 2 },
          { id: '2021', name: '2021', count: 3 },
        ],
        transmissions: [
          {
            id: Transmission.AUTOMATIC,
            name: Transmission.AUTOMATIC,
            count: 4,
          },
          { id: Transmission.MANUAL, name: Transmission.MANUAL, count: 3 },
        ],
        colors: [
          { id: 'red', name: 'red', count: 2 },
          { id: 'blue', name: 'blue', count: 3 },
        ],
        engineTypes: [
          { id: 'ไฮบริด', name: 'ไฮบริด', count: 1 },
          { id: 'เบนซิน', name: 'เบนซิน', count: 6 },
        ],
        engineCapacities: [
          { id: '1800', name: '1800', count: 2 },
          { id: '2000', name: '2000', count: 3 },
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
        engineType: 'ไฮบริด',
        engineCapacity: 1800,
      };
      const expectedResult: CarFilterResponseDto = {
        brands: [
          { id: 'Toyota', name: 'Toyota', count: 2, image: 'toyota-image-url' },
        ],
        types: [{ id: 'SUV', name: 'SUV', count: 2, image: 'suv-image-url' }],
        categories: [{ id: 'NEW', name: 'NEW', count: 2 }],
        models: [{ id: 'Corolla', name: 'Corolla', count: 2 }],
        subModels: [{ id: 'Altis', name: 'Altis', count: 2 }],
        modelYears: [{ id: '2020', name: '2020', count: 2 }],
        transmissions: [
          {
            id: Transmission.AUTOMATIC,
            name: Transmission.AUTOMATIC,
            count: 2,
          },
        ],
        colors: [{ id: 'red', name: 'red', count: 2 }],
        engineTypes: [{ id: 'ไฮบริด', name: 'ไฮบริด', count: 2 }],
        engineCapacities: [{ id: '1800', name: '1800', count: 2 }],
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
        engineCapacities: [],
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
        brands: [
          { id: 'Toyota', name: 'Toyota', count: 1, image: 'toyota-image-url' },
        ],
        types: [
          { id: 'SEDAN', name: 'SEDAN', count: 1, image: 'sedan-image-url' },
        ],
        categories: [{ id: 'USED', name: 'USED', count: 1 }],
        models: [{ id: 'Camry', name: 'Camry', count: 1 }],
        subModels: [{ id: 'Grande', name: 'Grande', count: 1 }],
        modelYears: [{ id: '2019', name: '2019', count: 1 }],
        transmissions: [
          { id: Transmission.MANUAL, name: Transmission.MANUAL, count: 1 },
        ],
        colors: [{ id: 'white', name: 'white', count: 1 }],
        engineTypes: [{ id: 'เบนซิน', name: 'เบนซิน', count: 1 }],
        engineCapacities: [{ id: '2000', name: '2000', count: 1 }],
      };

      mockCarFilterService.getFilters.mockResolvedValue(expectedResult);

      const result = await controller.getFilters(query);

      expect(result).toBe(expectedResult);
      expect(service.getFilters).toHaveBeenCalledTimes(1);
      expect(service.getFilters).toHaveBeenCalledWith(query);
    });
  });
});
