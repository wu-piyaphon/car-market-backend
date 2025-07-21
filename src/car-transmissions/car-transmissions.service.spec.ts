import { Test, TestingModule } from '@nestjs/testing';
import { CarTransmissionsService } from './car-transmissions.service';

describe('CarTransmissionsService', () => {
  let service: CarTransmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarTransmissionsService],
    }).compile();

    service = module.get<CarTransmissionsService>(CarTransmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
