import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';

async function bootstrap() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('/api/v1');

  await app.register(cors, {
    origin: true, // Replace on production frontend URL
    credentials: true, // Allow cookies to be sent
  });

  await app.register(cookie, {
    secret: 'y6£EY08GL90',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port, host);
  console.log(`🚀 Server is running at http://${host}:${port}`);
}
bootstrap();
