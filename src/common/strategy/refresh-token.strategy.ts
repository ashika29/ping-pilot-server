// strategies/refresh-token.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/http/user/user.service';

type RefreshTokenQuery = {
  refresh_token?: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest & { query: RefreshTokenQuery }) => {
          const cookieToken = req.cookies?.refresh_token;

          const queryToken = req.query?.refresh_token as string;

          return cookieToken || queryToken;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
