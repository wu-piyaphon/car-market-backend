import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { CarCategory } from '@/car-categories/entities/car-category.entity';
import { CarTransmission } from '@/car-transmissions/entities/car-transmission.entity';
import { CarType } from '@/car-types/entities/car-type.entity';
import { User } from '@/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  model: string;

  @Column()
  subModel: string;

  @Column({ name: 'model_year' })
  modelYear: number;

  @Column()
  color: string;

  @Column()
  engineType: string;

  @Column()
  engineCapacity: number;

  @Column({ nullable: true })
  mileage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true })
  images: string[];

  @Column()
  previousLicensePlate: string;

  @Column()
  currentLicensePlate: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdCars, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedCars, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @ManyToOne(() => CarBrand, (brand) => brand.cars, { eager: true })
  @JoinColumn({ name: 'car_brand_id' })
  brand: CarBrand;

  @ManyToOne(() => CarType, (carType) => carType.cars, { eager: true })
  @JoinColumn({ name: 'car_type_id' })
  type: CarType;

  @ManyToOne(() => CarTransmission, (transmission) => transmission.cars, {
    eager: true,
  })
  @JoinColumn({ name: 'car_transmission_id' })
  transmission: CarTransmission;

  @ManyToOne(() => CarCategory, (category) => category.cars, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'car_category_id' })
  category: CarCategory | null;
}
