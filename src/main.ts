import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 8000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            translateTime: 'HH:MM:ss Z',
            colorize: true,
            ignore: 'pid,hostname',
          },
        },
      },
    }),
  );
  app.setGlobalPrefix('/v1');

  await app.register(cors, {
    origin: process.env.FRONTEND_URL, // Replace on production frontend URL
    credentials: true, // Allow cookies to be sent
  });

  await app.register(cookie, {
    secret: 'y6£EY08GL90',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Ping Pilot API')
    .setDescription('API documentation for the Ping Pilot monitoring system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, host);
  console.log(`🚀 Server is running at http://${host}:${port}`);
  console.log(
    `📄 Swagger API docs available at http://${host}:${port}/api-docs`,
  );
}
bootstrap();
