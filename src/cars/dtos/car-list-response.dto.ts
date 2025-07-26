import { Car } from '@/cars/entities/car.entity';

export class CarListResponseDto {
  id: string;
  brand: string;
  type: string;
  transmission: string;
  category: string | null;
  images: string[];
  model: string;
  subModel: string;
  modelYear: number;
  price: number;
  previousLicensePlate: string;
  currentLicensePlate: string;
  isActive: boolean;

  constructor(car: Car) {
    this.id = car.id;
    this.brand = car.brand.name;
    this.type = car.type.name;
    this.transmission = car.transmission.name;
    this.category = car.category?.name;
    this.images = car.images;
    this.model = car.model;
    this.subModel = car.subModel;
    this.modelYear = car.modelYear;
    this.price = car.price;
    this.previousLicensePlate = car.previousLicensePlate;
    this.currentLicensePlate = car.currentLicensePlate;
    this.isActive = car.isActive;
  }
}
