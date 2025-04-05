import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SanitizeInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';
import { LoginResponseTransformer } from './transformers/login-response.transformer';
import { RegisterDto } from './dto/register.dto';
import { setAuthCookie } from 'src/utils/set-auth-cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(new SanitizeInterceptor(LoginResponseTransformer))
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, token } = await this.authService.login(loginDto);
    setAuthCookie(res, token);
    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('register')
  @UseInterceptors(new SanitizeInterceptor(LoginResponseTransformer))
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, token } = await this.authService.signup(registerDto);
    setAuthCookie(res, token);
    return {
      message: 'User resgistered',
      user,
    };
  }
}
