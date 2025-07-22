import { CreateCarTypeDto } from '@/car-types/dtos/create-car-type.dto';
import { UpdateCarTypeDto } from '@/car-types/dtos/update-car-type.dto';
import { CarType } from '@/car-types/entities/car-type.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarTypesService {
  constructor(
    @InjectRepository(CarType)
    private readonly carTypeRepository: Repository<CarType>,
  ) {}

  async findAll(): Promise<CarType[]> {
    return this.carTypeRepository.find();
  }

  async findOne(id: string): Promise<CarType> {
    const type = await this.carTypeRepository.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException('Car type not found');
    }
    return type;
  }

  async create(createCarTypeDto: CreateCarTypeDto): Promise<CarType> {
    const type = this.carTypeRepository.create(createCarTypeDto);
    try {
      return await this.carTypeRepository.save(type);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car type already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateCarTypeDto: UpdateCarTypeDto,
  ): Promise<CarType> {
    const existingType = await this.findOne(id);
    this.carTypeRepository.merge(existingType, updateCarTypeDto);
    try {
      return await this.carTypeRepository.save(existingType);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car type already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const type = await this.findOne(id);
    await this.carTypeRepository.remove(type);
  }
}
