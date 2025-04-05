import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { AuthModule } from './http/auth/auth.module';
import { UserModule } from './http/user/user.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';

@Module({
  imports: [ConfigurationModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
