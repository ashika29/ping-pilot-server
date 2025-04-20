import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { Tracker } from 'src/model/tracker.model';
import { User } from 'src/model/users.model';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private trackerRepo: Repository<Tracker>,
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
    return await this.trackerRepo.save(tracker);
  }

  async delete(id: number) {
    return await this.trackerRepo.delete(id);
  }
}
