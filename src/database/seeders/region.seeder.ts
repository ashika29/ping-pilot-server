import { Region } from 'src/model/region.model';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class RegionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log('Region seeding  started...');
    const resgionRepository = dataSource.getRepository(Region);
    await resgionRepository.save([
      { name: 'asia-north-mumbai' },
      { name: 'asia-south-banglore' },
    ]);
    console.log('Region seeding completed...');
  }
}
