import { faker } from '@faker-js/faker';
import { Tracker } from 'src/model/tracker.model';
import { User } from 'src/model/users.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TrackerSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Tracker seeding  started...');

    const trackerFactory = factoryManager.get(Tracker);
    const userRepo = dataSource.getRepository(User);
    const trackerRepo = dataSource.getRepository(Tracker);

    const testUsers = await userRepo.find({ take: 3 });
    const Users = await userRepo.find();
    // Create 50 trackers
    const trackers: Tracker[] = [];

    for (let i = 0; i < 3; i++) {
      const tracker = await trackerFactory.make({
        user: faker.helpers.arrayElement(testUsers),
      });
      trackers.push(tracker);
    }

    for (let i = 0; i < 50; i++) {
      const tracker = await trackerFactory.make({
        user: faker.helpers.arrayElement(Users),
      });
      trackers.push(tracker);
    }

    // Save to DB
    await trackerRepo.save(trackers);

    console.log('Tracker seeding completed...');
  }
}
