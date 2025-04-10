import { Tracker } from 'src/model/tracker.model';
import { setSeederFactory } from 'typeorm-extension';

export const TrackerFactory = setSeederFactory(Tracker, (faker) => {
  const tracker = new Tracker();
  tracker.url = faker.internet.url();
  tracker.params = { interval: 5 };
  tracker.preference = { pauseOnError: 5, statusPage: false };

  return tracker;
});
