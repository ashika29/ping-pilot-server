import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SanitizeInterceptor } from 'src/common/interceptors/sanitize-response.interceptor';
import { LoginResponseTransformer } from './transformers/login-response.transformer';
import { RegisterDto } from './dto/register.dto';
import {
  setAuthCookie,
  setRefreshTokenCookie,
} from 'src/utils/set-auth-cookie';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  removeAuthCookie,
  removeRefreshTokenCookie,
} from 'src/utils/remove-auth-cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(new SanitizeInterceptor(LoginResponseTransformer))
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, token, refreshToken } =
      await this.authService.login(loginDto);
    setAuthCookie(res, token);
    setRefreshTokenCookie(res, refreshToken);
    return {
      message: 'Login successful',
      token: token,
      refreshToken,
      user,
    };
  }

  @Post('register')
  @UseInterceptors(new SanitizeInterceptor(LoginResponseTransformer))
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, token, refreshToken } =
      await this.authService.signup(registerDto);
    setAuthCookie(res, token);
    setRefreshTokenCookie(res, refreshToken);
    return {
      message: 'User resgistered',
      token: token,
      refreshToken,
      user,
    };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('refresh-token'))
  async refresh(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { token, refreshToken } =
      await this.authService.getAccessAndRefreshToken(user);
    setAuthCookie(res, token);
    setRefreshTokenCookie(res, refreshToken);
    return {
      token,
      refreshToken,
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    removeAuthCookie(res);
    removeRefreshTokenCookie(res);
    return res.status(204).send();
  }
}
