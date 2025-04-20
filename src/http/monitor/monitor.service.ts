import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracker } from 'src/model/tracker.model';

@Injectable()
export class MonitorService {
  constructor(
    @InjectQueue('monitor-queue') private queue: Queue,
    @InjectRepository(Tracker) private trackerRepo: Repository<Tracker>,
  ) {}

  @Cron('0 * * * * *') // Every 1 minute
  async handleCron() {
    const trackers = await this.trackerRepo.find({
      where: { is_active: true },
      relations: ['user'],
    });

    for (const tracker of trackers) {
      await this.queue.add('check-url', {
        id: tracker.id,
        url: tracker.url,
        email: tracker.user.email,
        params: tracker.params,
        preference: tracker.preference,
      });
    }

    console.log(`[CRON] Queued ${trackers.length} URLs for monitoring`);
  }
}
