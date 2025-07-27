import { Test, TestingModule } from '@nestjs/testing';
import { CarFilterService } from './car-filter.service';

describe('CarFilterService', () => {
  let service: CarFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarFilterService],
    }).compile();

    service = module.get<CarFilterService>(CarFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
