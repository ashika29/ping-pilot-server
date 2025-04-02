import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/users.model';

import { Module } from '@nestjs/common';
import { UsersSeedService } from './users.service';
import { Role } from 'src/model/roles.model';
import { RoleSeederModule } from '../role/role.seeder.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RoleSeederModule],
  providers: [UsersSeedService],
  exports: [UsersSeedService],
})
export class UserSeederModule {}
