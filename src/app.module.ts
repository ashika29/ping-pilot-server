import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './configuration/configuration.module';
import { AuthModule } from './http/auth/auth.module';
import { UserModule } from './http/user/user.module';
import { JwtStrategy } from './common/strategy/jwt.strategy';
import { RefreshTokenStrategy } from './common/strategy/refresh-token.strategy';
import { BullModule } from '@nestjs/bull';
import { MonitorModule } from './http/monitor/monitor.module';
import { MonitorProcessor } from './http/monitor/monitor.process';
import { MonitorService } from './http/monitor/monitor.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './http/mail/mail.module';
import { MailService } from './http/mail/mail.service';
import { TrackerModule } from './http/tracker/tracker.module';

@Module({
  imports: [
    MonitorModule,
    ConfigurationModule,
    AuthModule,
    UserModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'monitor-queue',
    }),

    ScheduleModule.forRoot(),
    MailModule,
    TrackerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    RefreshTokenStrategy,
    MonitorService,
    MonitorProcessor,
    MailService,
  ],
})
export class AppModule {}
