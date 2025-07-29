import { Test, TestingModule } from '@nestjs/testing';
import { SellingRequestsController } from './selling-requests.controller';

describe('SellingRequestsController', () => {
  let controller: SellingRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellingRequestsController],
    }).compile();

    controller = module.get<SellingRequestsController>(SellingRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
