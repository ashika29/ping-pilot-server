import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import axios from 'axios';
import { MailService } from '../mail/mail.service';
import { Inject } from '@nestjs/common';

@Processor('monitor-queue')
export class MonitorProcessor {
  constructor(@Inject(MailService) private mailService: MailService) {}
  @Process('check-url')
  async checkUrl(job: Job) {
    const { url } = job.data;
    try {
      const res = await axios.get(url, { timeout: 5000 });
      console.log(`✅ ${url} is up with status: ${res.status}`);
    } catch (err) {
      //   await this.mailService.sendUrlDownAlert(url, err.message);
    }
  }
}
