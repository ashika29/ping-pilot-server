import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: ['*'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, host);
  console.log(`🚀 Server is running at http://${host}:${port}`);
}
bootstrap();
