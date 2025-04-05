import { Region } from 'src/model/region.model';
import { setSeederFactory } from 'typeorm-extension';

export const RegionFactory = setSeederFactory(Region, (faker) => {
  const region = new Region();
  region.name = faker.helpers.arrayElement([
    'asia-east',
    'asia-south',
    'us-east',
    'us-north',
  ]);

  return region;
});
