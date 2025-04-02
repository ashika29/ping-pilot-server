import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/users.model';
import { Repository } from 'typeorm';
import { userData } from './user.seeder.data';
import { Role } from 'src/model/roles.model';

@Injectable()
export class UsersSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async seed() {
    try {
      for (const user of userData) {
        const userEntity = this.userRepository.create(user);
        const role = await this.roleRepository.findOne({ where: { id: 1 } });
        if (!role) {
          throw new Error('Role with id 1 not found');
        }
        userEntity.role = role;
        await this.userRepository.save(userEntity);
      }
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  }
}
