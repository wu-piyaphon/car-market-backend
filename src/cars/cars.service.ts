import { CarBrandsService } from '@/car-brands/car-brands.service';
import { CarListQueryDto } from '@/cars/dtos/car-list-query.dto';
import { CarListResponseDto } from '@/cars/dtos/car-list-response.dto';
import { CreateCarDto } from '@/cars/dtos/create-car.dto';
import { UpdateCarDto } from '@/cars/dtos/update-car.dto';
import { Car } from '@/cars/entities/car.entity';
import { AwsS3Service } from '@/common/aws-s3.service';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';
import { getTimestamp } from '@/common/utils/date.utils';
import { generateCarSlug } from '@/common/utils/slug.utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private carBrandsService: CarBrandsService,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(
    car: CreateCarDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const timestamp = getTimestamp();

    const images = await Promise.all(
      files.map((file) => this.awsS3Service.uploadFile(file, 'cars')),
    );

    const brand = await this.carBrandsService.findOne(car.brandId);
    const slug = generateCarSlug(brand.name, car, timestamp);

    const createdCar = this.carsRepository.create({
      ...car,
      images,
      slug,
      brand: {
        id: car.brandId,
      },
      type: {
        id: car.typeId,
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

  async findAllPaginated(query: CarListQueryDto) {
    const {
      page = 1,
      pageSize = 10,
      type,
      brand,
      category,
      transmission,
      model,
      subModel,
      color,
      modelYear,
      engineType,
      engineCapacity,
      minMileage,
      maxMileage,
      minPrice,
      maxPrice,
      salesType,
      isActive,
      keyword,
    } = query;

    const qb = this.carsRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.type', 'type')
      .leftJoinAndSelect('car.category', 'category')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    // Equality filters
    const eqFilters = [
      { field: 'type', value: type, path: 'type.name' },
      { field: 'brand', value: brand, path: 'brand.name' },
      { field: 'category', value: category, path: 'category.name' },
      { field: 'model', value: model, path: 'car.model' },
      { field: 'subModel', value: subModel, path: 'car.sub_model' },
      { field: 'transmission', value: transmission, path: 'car.transmission' },
      { field: 'color', value: color, path: 'car.color' },
      { field: 'modelYear', value: modelYear, path: 'car.model_year' },
      { field: 'engineType', value: engineType, path: 'car.engine_type' },
      {
        field: 'engineCapacity',
        value: engineCapacity,
        path: 'car.engine_capacity',
      },
      { field: 'salesType', value: salesType, path: 'car.sales_type' },
      { field: 'isActive', value: isActive, path: 'car.is_active' },
    ];

    eqFilters.forEach(({ field, value, path }) => {
      if (!!value) {
        qb.andWhere(`${path} = :${field}`, { [field]: value });
      }
    });

    // Range filters
    if (minMileage !== undefined || maxMileage !== undefined) {
      qb.andWhere('car.mileage >= :minMileage', {
        minMileage: minMileage ?? 0,
      });
      qb.andWhere('car.mileage <= :maxMileage', {
        maxMileage: maxMileage ?? Number.MAX_SAFE_INTEGER,
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      qb.andWhere('car.price >= :minPrice', { minPrice: minPrice ?? 0 });
      qb.andWhere('car.price <= :maxPrice', {
        maxPrice: maxPrice ?? Number.MAX_SAFE_INTEGER,
      });
    }

    // Keyword filter
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      qb.andWhere(
        '(LOWER(car.model) ILIKE :keyword OR LOWER(car.sub_model) ILIKE :keyword)',
        { keyword: `%${keywordLower}%` },
      );
    }

    const [cars, total] = await qb.getManyAndCount();

    return new PaginationResponseDto({
      items: cars.map((car) => new CarListResponseDto(car)),
      total,
      page,
      pageSize,
    });
  }

  async findOneById(carId: string) {
    const car = await this.carsRepository.findOne({
      where: { id: carId },
      relations: ['brand', 'type', 'category', 'createdBy', 'updatedBy'],
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async findOneBySlug(slug: string) {
    const car = await this.carsRepository.findOne({
      where: { slug, isActive: true },
      relations: ['brand', 'type', 'category'],
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async update(
    carId: string,
    updateCarDto: UpdateCarDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const existingCar = await this.findOneById(carId);

    const oldImages = existingCar.images;
    if (oldImages.length > 0) {
      await this.awsS3Service.deleteFile(oldImages);
    }

    const images = await Promise.all(
      files.map((image) => this.awsS3Service.uploadFile(image, 'cars')),
    );

    const updatedCar = this.carsRepository.merge(existingCar, {
      ...updateCarDto,
      images,
    });

    return this.carsRepository.save({
      ...updatedCar,
      updatedBy: {
        id: userId,
      },
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
