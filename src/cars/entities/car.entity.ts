import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { CarCategory } from '@/car-categories/entities/car-category.entity';
import { CarType } from '@/car-types/entities/car-type.entity';
import { EngineType } from '@/common/enums/engine-type.enum';
import { SalesRequestType } from '@/common/enums/sales-request.enum';
import { Transmission } from '@/common/enums/transmission.enum';
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

  @Column({ unique: true })
  slug: string;

  @Column()
  model: string;

  @Column({ name: 'sub_model' })
  subModel: string;

  @Column({ name: 'model_year' })
  modelYear: number;

  @Column({ type: 'enum', enum: Transmission })
  transmission: Transmission;

  @Column()
  color: string;

  @Column({ name: 'engine_type', type: 'enum', enum: EngineType })
  engineType: EngineType;

  @Column({ name: 'engine_capacity' })
  engineCapacity: number;

  @Column({ nullable: true })
  mileage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('text', { array: true })
  images: string[];

  @Column({ name: 'previous_license_plate', nullable: true })
  previousLicensePlate: string;

  @Column({ name: 'new_license_plate', nullable: true })
  newLicensePlate: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sales_type', type: 'enum', enum: SalesRequestType })
  salesType: SalesRequestType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
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

  @ManyToOne(() => CarCategory, (category) => category.cars, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'car_category_id' })
  category: CarCategory | null;
}
