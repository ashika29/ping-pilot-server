import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import axios from 'axios';
import { MailService } from '../mail/mail.service';
import { Inject } from '@nestjs/common';
import { Tracker } from 'src/model/tracker.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Processor('monitor-queue')
export class MonitorProcessor {
  constructor(
    @Inject(MailService) private mailService: MailService,
    @InjectRepository(Tracker) private trackerRepo: Repository<Tracker>,
  ) {}
  @Process('check-url')
  async checkUrl(job: Job) {
    const { url, email, id } = job.data;

    try {
      const res = await axios.get(url, { timeout: 5000 });
    } catch (err) {
      await this.trackerRepo.update(id, {
        is_active: false,
      });
      await this.mailService.sendUrlDownAlert(url, err.message, email);
    }
  }
}
