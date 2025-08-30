import { Test, TestingModule } from '@nestjs/testing';
import { EstimateRequestsController } from './estimate-requests.controller';

describe('EstimateRequestsController', () => {
  let controller: EstimateRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimateRequestsController],
    }).compile();

    controller = module.get<EstimateRequestsController>(EstimateRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
