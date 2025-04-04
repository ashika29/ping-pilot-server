import { Role } from 'src/model/roles.model';
import { setSeederFactory } from 'typeorm-extension';

export const RoleFactory = setSeederFactory(Role, (faker) => {
  const role = new Role();
  role.name = faker.helpers.arrayElement(['Admin', 'User']);

  return role;
});
