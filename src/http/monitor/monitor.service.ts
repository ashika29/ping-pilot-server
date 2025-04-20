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
    @InjectQueue('monitor-queue') private readonly queue: Queue,
    @InjectRepository(Tracker)
    private readonly trackerRepo: Repository<Tracker>,
  ) {}

  @Cron('0 * * * * *') // Every 1 minute
  async handleCron() {
    const trackers = await await this.getUrlsFromDb();

    for (const tracker of trackers) {
      await this.queue.add('check-url', { tracker });
    }

    console.log(`[CRON] Queued ${trackers.length} URLs for monitoring`);
  }

  async getUrlsFromDb(): Promise<string[]> {
    // Replace this with actual DB fetch logic
    return ['https://google.com', 'https://some-non-working-url.com'];
  }
}
