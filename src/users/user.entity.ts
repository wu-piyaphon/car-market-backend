import { Car } from '@/cars/entities/car.entity';
import { Role } from '@/common/enums/role.enum';
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
}
