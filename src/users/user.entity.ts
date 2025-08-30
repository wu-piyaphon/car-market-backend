import { Car } from '@/cars/entities/car.entity';
import { Role } from '@/common/enums/role.enum';
import { EstimateRequest } from '@/estimate-requests/entities/estimate-request.entity';
import { SellingRequest } from '@/selling-requests/entities/selling-request.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @OneToMany(() => Car, (car) => car.createdBy)
  createdCars: Car[];

  @OneToMany(() => Car, (car) => car.updatedBy)
  updatedCars: Car[];

  @OneToMany(() => SellingRequest, (sellingRequest) => sellingRequest.updatedBy)
  updatedSellingRequests: SellingRequest[];

  @OneToMany(() => SellingRequest, (sellingRequest) => sellingRequest.updatedBy)
  updatedEstimateRequests: EstimateRequest[];
}
