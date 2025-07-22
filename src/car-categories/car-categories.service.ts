import { CreateCarCategoryDto } from '@/car-categories/dtos/create-car-category.dto';
import { UpdateCarCategoryDto } from '@/car-categories/dtos/update-car-category.dto';
import { CarCategory } from '@/car-categories/entities/car-category.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarCategoriesService {
  constructor(
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
  ) {}

  async findAll(): Promise<CarCategory[]> {
    return this.carCategoryRepository.find();
  }

  async findOne(id: string): Promise<CarCategory> {
    const category = await this.carCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Car category not found');
    }
    return category;
  }

  async create(
    createCarCategoryDto: CreateCarCategoryDto,
  ): Promise<CarCategory> {
    const category = this.carCategoryRepository.create(createCarCategoryDto);
    try {
      return await this.carCategoryRepository.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car category already exists');
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateCarCategoryDto: UpdateCarCategoryDto,
  ): Promise<CarCategory> {
    const existingCategory = await this.findOne(id);
    this.carCategoryRepository.merge(existingCategory, updateCarCategoryDto);

    try {
      return await this.carCategoryRepository.save(existingCategory);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Car category already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.carCategoryRepository.remove(category);
  }
}
