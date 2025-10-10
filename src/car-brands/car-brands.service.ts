import { CreateCarBrandDto } from '@/car-brands/dtos/create-car-brand.dto';
import { UpdateCarBrandDto } from '@/car-brands/dtos/update-car-brand.dto';
import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class CarBrandsService {
  constructor(
    @InjectRepository(CarBrand)
    private readonly carBrandRepository: Repository<CarBrand>,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findAll(): Promise<CarBrand[]> {
    return this.carBrandRepository.find();
  }

  async findOne(id: string): Promise<CarBrand> {
    const brand = await this.carBrandRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!brand) {
      throw new NotFoundException('Car brand not found');
    }
    return brand;
  }

  async findByName(name: string): Promise<CarBrand> {
    return this.carBrandRepository.findOne({
      where: { name, deletedAt: IsNull() },
    });
  }

  async create(
    createCarBrandDto: CreateCarBrandDto,
    file: Express.Multer.File,
  ): Promise<CarBrand> {
    const existingBrand = await this.carBrandRepository.findOne({
      where: { id: createCarBrandDto.id },
      withDeleted: true,
    });

    if (existingBrand && !existingBrand.deletedAt) {
      throw new BadRequestException('Car brand already exists');
    }

    const image = await this.awsS3Service.uploadFile(file, 'car-brands');

    if (existingBrand && existingBrand.deletedAt) {
      await this.restore(existingBrand.id);
      return await this.update(existingBrand.id, createCarBrandDto, file);
    }

    const brand = this.carBrandRepository.create({
      ...createCarBrandDto,
      image,
    });

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
    file: Express.Multer.File,
  ): Promise<CarBrand> {
    const existingBrand = await this.findOne(id);

    if (file) {
      await this.awsS3Service.deleteFile(existingBrand.image);
      const newImage = await this.awsS3Service.uploadFile(file, 'car-brands');
      existingBrand.image = newImage;
    }

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
    await this.carBrandRepository.softRemove(brand);
  }

  async restore(id: string): Promise<CarBrand> {
    const brand = await this.carBrandRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!brand) {
      throw new NotFoundException('Car brand not found');
    }
    if (!brand.deletedAt) {
      throw new BadRequestException('Car brand is not deleted');
    }
    await this.carBrandRepository.restore(id);
    return this.findOne(id);
  }

  async hardDelete(id: string): Promise<void> {
    const brand = await this.carBrandRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!brand) {
      throw new NotFoundException('Car brand not found');
    }

    await this.awsS3Service.deleteFile(brand.image);
    await this.carBrandRepository.remove(brand);
  }
}
