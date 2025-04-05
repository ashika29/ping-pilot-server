import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ConfigurationModule } from './configuration/configuration.module';
import { UrlLoadTimeModule } from './url-load-time/url-load-time.module';

@Module({
  imports: [ConfigurationModule, UrlLoadTimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
