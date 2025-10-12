import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { CarCategory } from '@/car-categories/entities/car-category.entity';
import { CarType } from '@/car-types/entities/car-type.entity';
import { SalesRequestType } from '@/common/enums/request.enum';
import { Transmission } from '@/common/enums/transmission.enum';
import { numericTransformer } from '@/common/utils/transform.utils';
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

  @Column({ name: 'engine_type' })
  engineType: string;

  @Column({ name: 'engine_capacity' })
  engineCapacity: number;

  @Column({ nullable: true })
  mileage: number;

  @Column({
    type: 'decimal',
    transformer: numericTransformer,
  })
  price: number;

  @Column('text', {
    array: true,
  })
  images: string[];

  @Column({ name: 'original_license_plate', nullable: true })
  originalLicensePlate: string;

  @Column({ name: 'current_license_plate' })
  currentLicensePlate: string;

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
