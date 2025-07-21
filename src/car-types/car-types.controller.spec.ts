import { Test, TestingModule } from '@nestjs/testing';
import { CarTypesController } from './car-types.controller';

describe('CarTypesController', () => {
  let controller: CarTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarTypesController],
    }).compile();

    controller = module.get<CarTypesController>(CarTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
