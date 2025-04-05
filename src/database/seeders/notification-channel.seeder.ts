import { NotificationsChannel } from 'src/model/notifications-channel.model';
import { User } from 'src/model/users.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class NotificationChannelSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('notifcation-channel seeding  started...');

    const userRepo = dataSource.getRepository(User);

    const testUsers = await userRepo.find({ take: 3 });

    // Create 50 trackers
    const notifcation: NotificationsChannel[] = [];

    console.log('notifcation-channel seeding completed...');
  }
}
