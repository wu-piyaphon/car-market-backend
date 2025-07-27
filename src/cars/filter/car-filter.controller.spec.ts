import { Test, TestingModule } from '@nestjs/testing';
import { CarFilterController } from './car-filter.controller';

describe('CarFilterController', () => {
  let controller: CarFilterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarFilterController],
    }).compile();

    controller = module.get<CarFilterController>(CarFilterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
