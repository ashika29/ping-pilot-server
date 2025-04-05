import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Service to measure the load time of a given URL.
 */
@Injectable()
export class UrlLoadTimeService {
  /**
   * Measures the load time of a URL by sending an HTTP GET request.
   * @param url - The URL to measure.
   * @returns The load time in milliseconds.
   * @throws BadRequestException if the URL is invalid or empty.
   */
  async getUrlLoadTime(url: string): Promise<number> {
    if (!url || !url.trim()) {
      throw new BadRequestException('URL cannot be empty or whitespace.');
    }

    try {
      const startTime = Date.now();

      await axios.get(url);
      const endTime = Date.now();
      return endTime - startTime;
    } catch {
      throw new BadRequestException('Invalid URL or unable to fetch the URL.');
    }
  }
}
