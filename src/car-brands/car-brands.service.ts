import { CreateCarBrandDto } from '@/car-brands/dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from '@/car-brands/dtos/update-car-brand.dto';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarBrandsService {
  constructor(
    @InjectRepository(CarBrand)
    private readonly carBrandRepository: Repository<CarBrand>,
  ) {}

  async findAll(): Promise<CarBrand[]> {
    return this.carBrandRepository.find();
  }

  async findOne(id: number): Promise<CarBrand> {
    const carBrand = await this.carBrandRepository.findOne({ where: { id } });
    if (!carBrand) {
      throw new NotFoundException('Car brand not found');
    }
    return carBrand;
  }

  async create(createCarBrandDto: CreateCarBrandDto): Promise<CarBrand> {
    const carBrand = this.carBrandRepository.create(createCarBrandDto);
    return this.carBrandRepository.save(carBrand);
  }

  async update(
    id: number,
    updateCarBrandDto: UpdateCarBrandDto,
  ): Promise<CarBrand> {
    const existingCarBrand = await this.findOne(id);
    Object.assign(existingCarBrand, updateCarBrandDto);
    await this.carBrandRepository.save(existingCarBrand);

    return existingCarBrand;
  }

  async remove(id: number): Promise<void> {
    const result = await this.carBrandRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Car brand not found');
    }
  }
}
