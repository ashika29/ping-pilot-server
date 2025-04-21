import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerController } from './tracker.controller';
import { Tracker } from 'src/model/tracker.model';
import { TrackerService } from './tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
  controllers: [TrackerController],
  providers: [TrackerService],
  exports: [TypeOrmModule],
})
export class TrackerModule {}
