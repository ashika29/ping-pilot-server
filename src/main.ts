import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
