import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Tracker } from './tracker.model';
import { User } from './users.model';
/**
CREATE TABLE public.activity_logs (
	tracker_id int4 NULL,
	updated_by int4 NULL,
	id serial4 NOT NULL,
	description varchar NULL,
	metadata jsonb NULL,
	"type" varchar NOT NULL,
	created_date timestamp DEFAULT now() NOT NULL,
	is_deleted bool DEFAULT false NOT NULL,
	CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY (id),
	CONSTRAINT "FK_592648c433753f78eb055f4bf58" FOREIGN KEY (tracker_id) REFERENCES public.trackers(id),
	CONSTRAINT "FK_8fdf5da9fe77b04769e7b605b1c" FOREIGN KEY (updated_by) REFERENCES public.users(id)
);
 */
@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tracker, (tracker) => tracker.id)
  @JoinColumn({ name: 'tracker_id' })
  tracker: Tracker;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by' })
  user: User;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: true, type: 'jsonb', default: null })
  metadata?: any;

  @Column({ nullable: false, type: 'varchar' })
  type: 'login' | 'logout' | 'error' | 'monitoring' | 'monitoring_error';

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  created_date: Date;

  @Column({ type: 'boolean', default: () => 'false' })
  is_deleted: boolean = false;
}
