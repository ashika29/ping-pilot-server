import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/model/roles.model';
import { User } from 'src/model/users.model';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`, // Path to the .env file
      isGlobal: true, // Makes ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const password = config.get<string>('DB_PASSWORD');
        if (!password || typeof password !== 'string') {
          console.log('pass', password);
          throw new Error('DB_PASSWORD must be a valid string');
        }

        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Role],
        };
      },
    }),
  ],
})
export class ConfigurationModule {}
