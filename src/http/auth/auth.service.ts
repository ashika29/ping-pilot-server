// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/model/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const token = this.getToken(user);

    return { user, token };
  }

  async signup(registerDto: RegisterDto) {
    const user = await this.userService.createUser(
      registerDto.email,
      registerDto.password,
    );

    const token = this.getToken(user);

    return { user, token };
  }

  getToken(user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '30m',
      },
    );
  }
}
