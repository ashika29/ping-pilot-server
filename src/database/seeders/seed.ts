import dbConfig from 'src/configuration/dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

import { MainSeeder } from './main.seeder';
import { UserFactory } from '../factories/user.factory';
import { RoleFactory } from '../factories/role.factory';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';
import { RegionSeeder } from './region.seeder';
import { TrackerSeeder } from './tracker.seeder';
import { TrackerFactory } from '../factories/tracker.factory';
import { RegionFactory } from '../factories/region.factory';
import { TrackerRegionSeeder } from './tracker-region.seeder';
import { NotificationChannelSeeder } from './notification-channel.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...dbConfig(),
  factories: [UserFactory, RoleFactory, TrackerFactory, RegionFactory],
  seeds: [
    RegionSeeder,
    RoleSeeder,
    UserSeeder,
    TrackerSeeder,
    TrackerRegionSeeder,
    NotificationChannelSeeder,
    MainSeeder,
  ],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize(true);
  await runSeeders(datasource);
  process.exit();
});
