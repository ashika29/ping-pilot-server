import { Injectable } from '@nestjs/common';

/**
 * The main service for the application.
 * Provides core application logic.
 */
@Injectable()
export class AppService {
  /**
   * Returns a welcome message.
   * @returns A string containing the welcome message.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
