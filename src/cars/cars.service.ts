import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { Car } from '@/cars/entities/car.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
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
}
