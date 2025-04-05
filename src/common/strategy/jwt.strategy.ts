// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/http/user/user.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest) => {
          console.log(req?.cookies?.pilot_token);
          return req?.cookies?.pilot_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUser(payload.sub);
    console.log('user:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; // this becomes `req.user`
  }
}
