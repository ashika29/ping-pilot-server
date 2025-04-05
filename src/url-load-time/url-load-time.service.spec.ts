import { UrlLoadTimeService } from './url-load-time.service';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UrlLoadTimeService', () => {
  let service: UrlLoadTimeService;

  beforeEach(() => {
    service = new UrlLoadTimeService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return load time for a valid URL', async () => {
    mockedAxios.get.mockResolvedValueOnce({});
    const url = 'https://example.com';
    const loadTime = await service.getUrlLoadTime(url);
    expect(loadTime).toBeGreaterThanOrEqual(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(url);
  });

  it('should throw BadRequestException for an empty URL', async () => {
    await expect(service.getUrlLoadTime('')).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.getUrlLoadTime('   ')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for an invalid URL', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Invalid URL'));
    await expect(service.getUrlLoadTime('invalid-url')).rejects.toThrow(
      BadRequestException,
    );
  });
});
