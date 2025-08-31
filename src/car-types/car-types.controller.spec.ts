import { Test, TestingModule } from '@nestjs/testing';
import { CarTypesController } from './car-types.controller';
import { CarTypesService } from './car-types.service';
import { CreateCarTypeDto } from './dtos/create-car-type.dto';
import { UpdateCarTypeDto } from './dtos/update-car-type.dto';
import { CarType } from './entities/car-type.entity';

describe('CarTypesController', () => {
  let controller: CarTypesController;
  let service: CarTypesService;

  const mockCarTypesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarTypesController],
      providers: [
        {
          provide: CarTypesService,
          useValue: mockCarTypesService,
        },
      ],
    }).compile();

    controller = module.get<CarTypesController>(CarTypesController);
    service = module.get<CarTypesService>(CarTypesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of car types', async () => {
      const expectedResult: CarType[] = [
        {
          id: 'car-type-uuid-1',
          name: 'SEDAN',
          image: 'sedan-image-url',
          cars: [],
        },
        {
          id: 'car-type-uuid-2',
          name: 'SUV',
          image: 'suv-image-url',
          cars: [],
        },
      ];

      mockCarTypesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no car types exist', async () => {
      const expectedResult: CarType[] = [];

      mockCarTypesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a car type by id', async () => {
      const id = 'car-type-uuid';
      const expectedResult: CarType = {
        id: 'car-type-uuid',
        name: 'SEDAN',
        image: 'sedan-image-url',
        cars: [],
      };

      mockCarTypesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a car type with file', async () => {
      const createDto: CreateCarTypeDto = {
        name: 'SEDAN',
      };

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'sedan.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1000,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      const expectedResult: CarType = {
        id: 'car-type-uuid',
        name: 'SEDAN',
        image: 'uploaded-image-url',
        cars: [],
      };

      mockCarTypesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, file);

      expect(service.create).toHaveBeenCalledWith(createDto, file);
      expect(result).toEqual(expectedResult);
    });

    it('should create a car type with different name', async () => {
      const createDto: CreateCarTypeDto = {
        name: 'HATCHBACK',
      };

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'hatchback.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1000,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      const expectedResult: CarType = {
        id: 'car-type-uuid-2',
        name: 'HATCHBACK',
        image: 'hatchback-image-url',
        cars: [],
      };

      mockCarTypesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto, file);

      expect(service.create).toHaveBeenCalledWith(createDto, file);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a car type with file', async () => {
      const id = 'car-type-uuid';
      const updateDto: UpdateCarTypeDto = {
        name: 'UPDATED_SEDAN',
      };

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'updated-sedan.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1000,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      const expectedResult: CarType = {
        id: 'car-type-uuid',
        name: 'UPDATED_SEDAN',
        image: 'updated-image-url',
        cars: [],
      };

      mockCarTypesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, file);

      expect(service.update).toHaveBeenCalledWith(id, updateDto, file);
      expect(result).toEqual(expectedResult);
    });

    it('should update a car type without file', async () => {
      const id = 'car-type-uuid';
      const updateDto: UpdateCarTypeDto = {
        name: 'UPDATED_SUV',
      };

      const file: Express.Multer.File = null;

      const expectedResult: CarType = {
        id: 'car-type-uuid',
        name: 'UPDATED_SUV',
        image: 'existing-image-url',
        cars: [],
      };

      mockCarTypesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, file);

      expect(service.update).toHaveBeenCalledWith(id, updateDto, file);
      expect(result).toEqual(expectedResult);
    });

    it('should update only specific fields', async () => {
      const id = 'car-type-uuid';
      const updateDto: UpdateCarTypeDto = {}; // Empty update (partial)

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'new-image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1000,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      const expectedResult: CarType = {
        id: 'car-type-uuid',
        name: 'EXISTING_NAME',
        image: 'new-image-url',
        cars: [],
      };

      mockCarTypesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto, file);

      expect(service.update).toHaveBeenCalledWith(id, updateDto, file);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a car type', async () => {
      const id = 'car-type-uuid';

      mockCarTypesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should remove a different car type', async () => {
      const id = 'another-car-type-uuid';

      mockCarTypesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
