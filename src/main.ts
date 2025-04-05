import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * The entry point of the application.
 * Configures and starts the NestJS application.
 */
async function bootstrap() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 8000;

  /**
   * Create the NestJS application with Fastify adapter.
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  /**
   * Set global configurations for the application.
   */
  app.setGlobalPrefix('/api/v1');
  app.enableCors({ origin: ['*'] });
  app.useGlobalPipes(new ValidationPipe());

  /**
   * Configure Swagger for API documentation.
   */
  const config = new DocumentBuilder()
    .setTitle('Ping Pilot API')
    .setDescription('API documentation for the Ping Pilot monitoring system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  /**
   * Start the application and listen on the specified host and port.
   */
  await app.listen(port, host);
  console.log(`🚀 Server is running at http://${host}:${port}`);
  console.log(
    `📄 Swagger API docs available at http://${host}:${port}/api-docs`,
  );
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
