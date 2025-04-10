import { faker } from '@faker-js/faker';
import { Region } from 'src/model/region.model';
import { TrackerRegion } from 'src/model/tracker-region.model';
import { Tracker } from 'src/model/tracker.model';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class TrackerRegionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Tracker-region seeding  started...');
    const trackerRepo = dataSource.getRepository(Tracker);
    const regionRepo = dataSource.getRepository(Region);
    const trackerRegionRepo = dataSource.getRepository(TrackerRegion);

    const trackers = await trackerRepo.find();
    const regions = await regionRepo.find();

    const trackerRegionEntries: TrackerRegion[] = [];

    for (const tracker of trackers) {
      const randomRegions = faker.helpers.arrayElements(
        regions,
        faker.number.int({ min: 1, max: 3 }),
      );

      for (const region of randomRegions) {
        const trackerRegion = trackerRegionRepo.create({
          tracker,
          region,
        });
        trackerRegionEntries.push(trackerRegion);
      }
    }
    await trackerRegionRepo.save(trackerRegionEntries);
    console.log('Tracker-region seeding completed...');
  }
}
