import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrackerRegion } from './tracker-region.model';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  is_active: boolean;

  @OneToMany(() => TrackerRegion, (tr) => tr.region)
  trackerRegions!: TrackerRegion[];
}
