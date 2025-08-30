import {
  RequestContactStatus,
  SalesRequestType,
} from '@/common/enums/request.enum';
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

@Entity('selling_requests')
export class SellingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'nickname' })
  nickname: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'note', default: '' })
  note: string;

  @Column({ name: 'type', type: 'enum', enum: SalesRequestType })
  type: SalesRequestType;

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
