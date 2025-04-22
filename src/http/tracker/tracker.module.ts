import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerController } from './tracker.controller';
import { Tracker } from 'src/model/tracker.model';
import { TrackerService } from './tracker.service';
import { MonitorService } from '../monitor/monitor.service';
import { BullModule } from '@nestjs/bull';
import { ActivityLog } from 'src/model/activity-logs.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tracker, ActivityLog]),
    BullModule.registerQueue({
      name: 'monitor-queue',
    }),
  ],
  controllers: [TrackerController],
  providers: [TrackerService, MonitorService],
  exports: [TypeOrmModule],
})
export class TrackerModule {}
