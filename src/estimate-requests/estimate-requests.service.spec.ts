import { Test, TestingModule } from '@nestjs/testing';
import { EstimateRequestsService } from './estimate-requests.service';

describe('EstimateRequestsService', () => {
  let service: EstimateRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstimateRequestsService],
    }).compile();

    service = module.get<EstimateRequestsService>(EstimateRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
