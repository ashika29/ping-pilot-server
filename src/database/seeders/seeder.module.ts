import { Logger, Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserSeederModule } from './user/user.seeder.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { RoleSeederModule } from './role/role.seeder.module';

@Module({
  imports: [UserSeederModule, ConfigurationModule, RoleSeederModule],
  providers: [Logger, SeederService],
})
export class SeederModule {}
