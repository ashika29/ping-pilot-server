import dbConfig from 'src/configuration/dbConfig';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

import { MainSeeder } from './main.seeder';
import { UserFactory } from '../factories/user.factory';
import { RoleFactory } from '../factories/role.factory';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

const options: DataSourceOptions & SeederOptions = {
  ...dbConfig(),
  factories: [UserFactory, RoleFactory],
  seeds: [RoleSeeder, UserSeeder, MainSeeder],
};

const datasource = new DataSource(options);
datasource.initialize().then(async () => {
  await datasource.synchronize(true);
  await runSeeders(datasource);
  process.exit();
});
