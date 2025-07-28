import { CreateCarTypeDto } from '@/car-types/dtos/create-car-type.dto';
import { UpdateCarTypeDto } from '@/car-types/dtos/update-car-type.dto';
import { CarType } from '@/car-types/entities/car-type.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
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
    private readonly awsS3Service: AwsS3Service,
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

  async create(
    createCarTypeDto: CreateCarTypeDto,
    file: Express.Multer.File,
  ): Promise<CarType> {
    const image = await this.awsS3Service.uploadFile(file, 'car-types');
    const type = this.carTypeRepository.create({
      ...createCarTypeDto,
      image,
    });
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
    file: Express.Multer.File,
  ): Promise<CarType> {
    const existingType = await this.findOne(id);

    if (file) {
      await this.awsS3Service.deleteFile(existingType.image);
      const newImage = await this.awsS3Service.uploadFile(file, 'car-types');
      existingType.image = newImage;
    }

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
    await this.awsS3Service.deleteFile(type.image);
    await this.carTypeRepository.remove(type);
  }
}
