import { Car } from '@/cars/entities/car.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('car_brands')
export class CarBrand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Car, (car) => car.brand)
  cars: Car[];
}
