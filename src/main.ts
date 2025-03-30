import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(port, host);
  console.log(`🚀 Server is running at http://${host}:${port}`);
}
bootstrap();
