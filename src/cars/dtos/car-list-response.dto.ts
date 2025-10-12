import { Car } from '@/cars/entities/car.entity';
import { Transmission } from '@/common/enums/transmission.enum';

export class CarListResponseDto {
  id: string;
  brand: string;
  type: string;
  transmission: Transmission;
  category: string | null;
  thumbnail: string | null;
  model: string;
  subModel: string;
  modelYear: number;
  price: number;
  originalLicensePlate: string;
  currentLicensePlate: string;
  isActive: boolean;
  slug: string;

  constructor(car: Car) {
    this.id = car.id;
    this.brand = car.brand.id;
    this.type = car.type.id;
    this.transmission = car.transmission;
    this.category = car.category?.id || null;
    this.thumbnail = car.images[0] || null;
    this.model = car.model;
    this.subModel = car.subModel;
    this.modelYear = car.modelYear;
    this.price = car.price;
    this.originalLicensePlate = car.originalLicensePlate;
    this.currentLicensePlate = car.currentLicensePlate;
    this.isActive = car.isActive;
    this.slug = car.slug;
  }
}
