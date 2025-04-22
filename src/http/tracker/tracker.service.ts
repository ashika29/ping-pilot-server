import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { Tracker } from 'src/model/tracker.model';
import { User } from 'src/model/users.model';
import { MonitorService } from '../monitor/monitor.service';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepo: Repository<Tracker>,

    @Inject(forwardRef(() => MonitorService))
    private monitorService: MonitorService,
  ) {}

  findAllByUser(userId: number) {
    return this.trackerRepo.find({
      where: { user: { id: userId }, is_active: true },
      relations: ['trackerRegions'],
    });
  }

  async create(user: User, createDto: CreateTrackerDto) {
    const tracker = this.trackerRepo.create({
      ...createDto,
      user: { id: user.id },
    });
    const output = await this.trackerRepo.save(tracker);
    await this.monitorService.addOrUpdateCronJob(tracker);
    return output;
  }

  async delete(id: number) {
    const tracker = await this.trackerRepo.findOne({ where: { id } });
    if (!tracker) {
      throw new Error('Tracker not found');
    }
    await this.monitorService.removeCronJob(id);
    await this.trackerRepo.update(id, { is_active: false });
    return await this.trackerRepo.delete(id);
  }
}
