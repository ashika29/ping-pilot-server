import { IsNotEmpty, IsUrl, IsObject, IsOptional } from 'class-validator';

export class CreateTrackerDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsObject()
  params?: {
    method?: string; // HTTP method (GET, POST, etc.)
    body?: Record<string, any>; // Request body for POST/PUT requests
    query?: Record<string, string>; // Query parameters for the URL
    timeout?: number; // Timeout in milliseconds for the request
    headers?: Record<string, string>; // Custom headers for the request
    interval?: number; // Interval in seconds for checking the URL
  };

  @IsOptional()
  @IsObject()
  preference?: {
    onDemand?: boolean; // Whether the tracker is on-demand
    schedule?: string; // Cron schedule string
    pauseOnError?: number; // Number of errors before pausing the tracker
    statusPage?: boolean; // Whether to create a status page for the tracker
    notify?: boolean; // Whether to send notifications for the tracker
  };
}
