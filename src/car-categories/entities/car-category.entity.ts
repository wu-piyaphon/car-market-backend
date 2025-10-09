import { Car } from '@/cars/entities/car.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity('car_categories')
export class CarCategory {
  @Column({ primary: true, unique: true })
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Car, (car) => car.category)
  cars: Car[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
