import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * The main controller for the application.
 * Provides endpoints for basic application functionality.
 */
@ApiTags('App')
@Controller()
export class AppController {
  /**
   * Constructor for AppController.
   * @param appService - The service providing application logic.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a welcome message.
   * @returns A string containing the welcome message.
   */
  @ApiOperation({ summary: 'Get a welcome message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message.' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check endpoint.
   * @returns A string indicating the server is healthy.
   */
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns OK if the server is healthy.',
  })
  @Get('/health')
  healthCheck(): string {
    return 'ok';
  }
}
