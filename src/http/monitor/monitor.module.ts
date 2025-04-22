import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from 'src/model/activity-logs.model';
import { Tracker } from 'src/model/tracker.model';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker, ActivityLog])],
})
export class MonitorModule {}
