import { Injectable } from '@nestjs/common';
import { UsersSeedService } from './user/users.service';

@Injectable()
export class SeederService {
  constructor(private readonly userSeederService: UsersSeedService) {}

  async seed() {
    await this.userSeederService.seed();
  }
}
