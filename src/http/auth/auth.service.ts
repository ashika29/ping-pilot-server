// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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

    const token = this.jwtService.sign({
      sub: user.id,
    });

    return { user, token };
  }

  async signup(registerDto: RegisterDto) {
    const user = await this.userService.createUser(
      registerDto.email,
      registerDto.password,
    );

    const token = this.jwtService.sign({
      sub: user.id,
    });

    return { user, token };
  }
}
