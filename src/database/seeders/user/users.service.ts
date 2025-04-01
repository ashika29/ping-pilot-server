import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/users.model';
import { Repository } from 'typeorm';

@Injectable()
export class UsersSeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
      },
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedpassword',
      },
    ];
    await this.userRepository.save(users);
  }
}
