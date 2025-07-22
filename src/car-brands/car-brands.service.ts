import { CreateCarBrandDto } from '@/car-brands/dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from '@/car-brands/dtos/update-car-brand.dto';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: string): Promise<CarBrand> {
    const brand = await this.carBrandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Car brand not found');
    }
    return brand;
  }

  async create(createCarBrandDto: CreateCarBrandDto): Promise<CarBrand> {
    const brand = this.carBrandRepository.create(createCarBrandDto);
    try {
      return await this.carBrandRepository.save(brand);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car brand already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateCarBrandDto: UpdateCarBrandDto,
  ): Promise<CarBrand> {
    const existingBrand = await this.findOne(id);
    this.carBrandRepository.merge(existingBrand, updateCarBrandDto);
    try {
      return await this.carBrandRepository.save(existingBrand);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car brand already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id);
    await this.carBrandRepository.remove(brand);
  }
}
