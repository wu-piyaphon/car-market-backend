import { Test, TestingModule } from '@nestjs/testing';
import { CarTransmissionsController } from './car-transmissions.controller';

describe('CarTransmissionsController', () => {
  let controller: CarTransmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarTransmissionsController],
    }).compile();

    controller = module.get<CarTransmissionsController>(
      CarTransmissionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
