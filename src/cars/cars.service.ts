import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { Car } from '@/cars/entities/car.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { CarListResponseDto } from '@/cars/dtos/car-list-response.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(
    car: CreateCarDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const datePrefix = new Date().toISOString().split('T')[0];

    const images = await Promise.all(
      files.map((file) =>
        this.awsS3Service.uploadFile(
          file,
          `cars/${datePrefix}/${uuidv4()}-${file.originalname}`,
        ),
      ),
    );

    const createdCar = this.carsRepository.create({
      ...car,
      images,
      brand: {
        id: car.brandId,
      },
      type: {
        id: car.typeId,
      },
      transmission: {
        id: car.transmissionId,
      },
      category: {
        id: car.categoryId,
      },
      createdBy: {
        id: userId,
      },
    });

    return this.carsRepository.save(createdCar);
  }

  async findAll(page: number, pageSize: number) {
    const [cars, total] = await this.carsRepository.findAndCount({
      relations: ['brand', 'type', 'transmission', 'category'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return new PaginationResponseDto({
      items: cars.map((car) => new CarListResponseDto(car)),
      total,
      page,
      pageSize,
    });
  }

  async findOne(carId: string) {
    return this.carsRepository.findOne({
      where: { id: carId },
      relations: ['brand', 'type', 'transmission', 'category'],
    });
  }

  async delete(carId: string) {
    const car = await this.carsRepository.findOne({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    await this.awsS3Service.deleteFile(car.images);
    await this.carsRepository.delete(carId);
  }
}
