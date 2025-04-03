import { Faker } from '@faker-js/faker';
import { User } from 'src/model/users.model';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.name = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = 'secret123!';
  return user;
});
