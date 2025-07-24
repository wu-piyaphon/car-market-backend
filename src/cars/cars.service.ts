import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { Car } from '@/cars/entities/car.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const images = await Promise.all(
      files.map((file) =>
        this.awsS3Service.uploadFile(file, file.originalname),
      ),
    );

    const createdCar = this.carsRepository.create({
      ...car,
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
      images,
      createdAt: new Date(),
      updatedAt: null,
      createdBy: {
        id: userId,
      },
      updatedBy: null,
    });

    return this.carsRepository.save(createdCar);
  }
}
