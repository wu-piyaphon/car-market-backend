import { Car } from '@/cars/entities/car.entity';
import { EstimateRequest } from '@/estimate-requests/entities/estimate-request.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity('car_brands')
export class CarBrand {
  @Column({ primary: true, unique: true })
  id: string;

  @Column()
  image: string;

  @Column({ unique: true })
  name: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => Car, (car) => car.brand)
  cars: Car[];

  @OneToMany(() => EstimateRequest, (estimateRequest) => estimateRequest.brand)
  estimateRequests: EstimateRequest[];
}
