import { Car } from '@/cars/entities/car.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity('car_types')
export class CarType {
  @Column({ primary: true, unique: true })
  id: string;

  @Column()
  image: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Car, (car) => car.type)
  cars: Car[];

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
