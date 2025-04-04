import { Role } from 'src/model/roles.model';
import { User } from 'src/model/users.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('User seeding  started...');
    let userRepository = dataSource.getRepository(User);
    let userDatas = userRepository.create([
      {
        name: 'Saravana',
        email: 'saravana@pingpilot.com',
        password: '12345678',
        role: { id: 1 },
      },
      {
        name: 'Saravana Thiyagarajan',
        email: 'sai@pingpilot.com',
        password: '12345678',
        role: { id: 2 },
      },
      {
        name: 'Ashika',
        email: 'ashika@pingpilot.com',
        password: '12345678',
        role: { id: 1 },
      },
    ]);
    await userRepository.save(userDatas);
    const userFactory = factoryManager.get(User);
    await userFactory.saveMany(100);

    console.log('User seeding completed...');
  }
}
