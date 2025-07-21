import { Test, TestingModule } from '@nestjs/testing';
import { CarTypesService } from './car-types.service';

describe('CarTypesService', () => {
  let service: CarTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarTypesService],
    }).compile();

    service = module.get<CarTypesService>(CarTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
