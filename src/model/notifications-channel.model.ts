import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.model';

@Entity('notification_channels')
export class NotificationsChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column('json', { nullable: false })
  params: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
