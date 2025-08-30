import {
  RequestContactStatus,
  SalesRequestType,
} from '@/common/enums/request.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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
}
