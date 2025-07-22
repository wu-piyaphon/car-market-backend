import { CreateCarTransmissionDto } from '@/car-transmissions/dtos/create-car-transmission.dto';
import { UpdateCarTransmissionDto } from '@/car-transmissions/dtos/update-car-transmission.dto';
import { CarTransmission } from '@/car-transmissions/entities/car-transmission.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarTransmissionsService {
  constructor(
    @InjectRepository(CarTransmission)
    private readonly carTransmissionRepository: Repository<CarTransmission>,
  ) {}

  async findAll(): Promise<CarTransmission[]> {
    return this.carTransmissionRepository.find();
  }

  async findOne(id: string): Promise<CarTransmission> {
    const transmission = await this.carTransmissionRepository.findOne({
      where: { id },
    });
    if (!transmission) {
      throw new NotFoundException('Car transmission not found');
    }
    return transmission;
  }

  async create(
    createCarTransmissionDto: CreateCarTransmissionDto,
  ): Promise<CarTransmission> {
    const transmission = this.carTransmissionRepository.create(
      createCarTransmissionDto,
    );
    try {
      return await this.carTransmissionRepository.save(transmission);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car transmission already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateCarTransmissionDto: UpdateCarTransmissionDto,
  ): Promise<CarTransmission> {
    const existingTransmission = await this.findOne(id);
    this.carTransmissionRepository.merge(
      existingTransmission,
      updateCarTransmissionDto,
    );

    try {
      return await this.carTransmissionRepository.save(existingTransmission);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car transmission already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const transmission = await this.findOne(id);
    await this.carTransmissionRepository.remove(transmission);
  }
}
