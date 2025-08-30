import { CarBrand } from '@/car-brands/entities/car-brand.entity';
import { RequestContactStatus } from '@/common/enums/request.enum';
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

@Entity('estimate_requests')
export class EstimateRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CarBrand, (brand) => brand.cars, { eager: true })
  @JoinColumn({ name: 'car_brand_id' })
  brand: CarBrand;

  @Column()
  model: string;

  @Column({ name: 'model_year' })
  modelYear: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'line_id', nullable: true })
  lineId: string;

  @Column('text', { array: true })
  images: string[];

  @Column({ name: 'note', default: '' })
  note: string;

  @Column({
    name: 'installments_in_month',
    type: 'int',
    default: null,
    nullable: true,
  })
  installmentsInMonth: number | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: RequestContactStatus,
    default: RequestContactStatus.NOT_CONTACTED,
  })
  status: RequestContactStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.updatedCars, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;
}
