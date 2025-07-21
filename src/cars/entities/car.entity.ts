import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { CarCategory } from '@/car-categories/entities/car-category.entity';
import { CarTransmission } from '@/car-transmissions/entities/car-transmission.entity';
import { CarType } from '@/car-types/entities/car-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'model_year' })
  modelYear: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => CarBrand, (brand) => brand.cars, { eager: true })
  @JoinColumn({ name: 'brand_id' })
  brand: CarBrand;

  @ManyToOne(() => CarType, (carType) => carType.cars, { eager: true })
  @JoinColumn({ name: 'car_type_id' })
  carType: CarType;

  @ManyToOne(() => CarTransmission, (transmission) => transmission.cars, {
    eager: true,
  })
  @JoinColumn({ name: 'car_transmission_id' })
  transmission: CarTransmission;

  @ManyToOne(() => CarCategory, (category) => category.cars, { eager: true })
  @JoinColumn({ name: 'car_category_id' })
  category: CarCategory;
}
