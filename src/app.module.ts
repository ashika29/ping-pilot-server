import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { User } from './model/users.model';
import { Role } from './model/roles.model';
import { ConfigurationModule } from './configuration/configuration.module';
import { SeederModule } from './database/seeders/seeder.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
        defaultJobOptions: { attempts: 3 },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'default',
    }),
    ConfigurationModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
