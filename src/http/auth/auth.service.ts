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

    let { token, refreshToken } = await this.getAccessAndRefreshToken(user);

    return { user, token, refreshToken };
  }

  async signup(registerDto: RegisterDto) {
    const user = await this.userService.createUser(
      registerDto.email,
      registerDto.password,
    );

    let { token, refreshToken } = await this.getAccessAndRefreshToken(user);

    return { user, token, refreshToken };
  }

  async getAccessAndRefreshToken(user: User) {
    const token = this.getToken(user);
    const refreshToken = this.getRefreshToken(user);
    return { token, refreshToken };
  }

  getToken(user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '15m',
      },
    );
  }

  getRefreshToken(user: User) {
    return this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
  }
}
