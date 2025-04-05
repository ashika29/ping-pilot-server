import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlLoadTimeService } from './url-load-time.service';

@ApiTags('URL Load Time')
@Controller('url-load-time')
export class UrlLoadTimeController {
  constructor(private readonly urlLoadTimeService: UrlLoadTimeService) {}

  @ApiOperation({ summary: 'Get the load time of a URL' })
  @ApiQuery({
    name: 'url',
    description: 'The URL to measure load time for',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The load time of the URL in milliseconds',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL or missing query parameter',
  })
  @Get()
  async getUrlLoadTime(
    @Query('url') url: string,
  ): Promise<{ url: string; loadTime: number }> {
    const loadTime = await this.urlLoadTimeService.getUrlLoadTime(url);
    return { url, loadTime };
  }
}
