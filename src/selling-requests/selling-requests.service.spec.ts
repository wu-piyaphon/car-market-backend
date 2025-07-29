import { Test, TestingModule } from '@nestjs/testing';
import { SellingRequestsService } from './selling-requests.service';

describe('SellingRequestsService', () => {
  let service: SellingRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellingRequestsService],
    }).compile();

    service = module.get<SellingRequestsService>(SellingRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
