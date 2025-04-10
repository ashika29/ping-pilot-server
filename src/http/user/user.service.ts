import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/model/users.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async createUser(email: string, password: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('Email already exist');
    }

    user = this.userRepository.create({
      name: email.split('@')[0],
      email: email,
      password: password,
      role: { id: 2 }, // static user roles
    });

    user = await this.userRepository.save(user);

    return user;
  }

  async getUser(id: number): Promise<User> {
    let user = await this.userRepository.findOne({
      where: {
        id: id,
        is_blocked: false, // assuming it's a boolean column
      },
      select: ['id', 'name', 'email', 'created_at'],
    });

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return user;
  }
}
