import { Module } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from 'src/model/tracker.model';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
})
export class MonitorModule {}
