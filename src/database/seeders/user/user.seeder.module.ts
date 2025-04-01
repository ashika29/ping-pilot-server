import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/users.model';

import { Module } from '@nestjs/common';
import { UsersSeedService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersSeedService],
  exports: [UsersSeedService],
})
export class UserSeederModule {}
