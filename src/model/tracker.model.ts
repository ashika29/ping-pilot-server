import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.model';
import { TrackerRegion } from './tracker-region.model';

@Entity('trackers')
export class Tracker {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: false })
  url: string;

  @Column('json', { nullable: false })
  params: any;

  @Column('json', { nullable: false })
  preference: any;

  @Column({ nullable: true, default: 1 })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => TrackerRegion, (tr) => tr.region)
  trackerRegions!: TrackerRegion[];
}
