import { Test, TestingModule } from '@nestjs/testing';
import { CarCategoriesController } from './car-categories.controller';

describe('CarCategoriesController', () => {
  let controller: CarCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarCategoriesController],
    }).compile();

    controller = module.get<CarCategoriesController>(CarCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
