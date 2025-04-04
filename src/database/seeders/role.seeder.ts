import { Role } from 'src/model/roles.model';
import { User } from 'src/model/users.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Role seeding  started...');
    const roleRepo = dataSource.getRepository(Role);
    await roleRepo.save([{ name: 'Admin' }, { name: 'User' }]);
    console.log('Role seeding seeding completed...');
  }
}
