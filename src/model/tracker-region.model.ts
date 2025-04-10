import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Tracker } from './tracker.model';
import { Region } from './region.model';

@Entity('tracker_regions')
export class TrackerRegion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tracker, (tracker) => tracker.trackerRegions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tracker_id' })
  tracker: Tracker;

  @ManyToOne(() => Region, (region) => region.trackerRegions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'region_id' })
  region: Region;
}
