import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MailService } from '../mail/mail.service';
import { Inject } from '@nestjs/common';
import { Tracker } from 'src/model/tracker.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitorDto } from 'src/common/dto/monitor.dto';
import { ActivityLog } from 'src/model/activity-logs.model';

@Processor('monitor-queue')
export class MonitorProcessor {
  constructor(
    @Inject(MailService) private mailService: MailService,
    @InjectRepository(Tracker) private trackerRepo: Repository<Tracker>,
    @InjectRepository(ActivityLog)
    private activityLogRepo: Repository<ActivityLog>,
  ) {}

  /**
   * * This method is called to process the job in the queue
   * @param {Job<MonitorDto>} job - The job object containing the data to process
   * @param {string} job.data.url - The URL to check
   * @param {string} job.data.email - The email of the user to notify
   * @param {number} job.data.id - The ID of the tracker
   * @param {object} job.data.preference - The preference object containing the schedule and other options
   * @returns {Promise<void>} - A promise that resolves when the job is processed
   */
  @Process('check-url')
  async checkUrl(job: Job<MonitorDto>) {
    const { url, email, id, preference } = job.data;

    try {
      const startTime = Date.now();
      const statusResponse = await this.getUrlStatus(job.data);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log('Response Time:', responseTime, 'ms');
      await this.activityLogRepo.save(
        this.logSuccessResponse(job, statusResponse, responseTime),
      );
    } catch (err) {
      await this.trackerRepo.update(id, {
        is_active: false,
      });
      await this.activityLogRepo.save(this.logErrorResponse(job, err, 0));
      if (preference?.notify) {
        await this.mailService.sendUrlDownAlert(url, err.message, email);
      }
      console.log('Error:', err.message);
    }
  }

  /**
   * * This method is called to get the status of the URL
   * @param {MonitorDto} data - The data object containing the URL and other parameters
   * @param {string} data.url - The URL to check
   * @param {object} data.params - The parameters for the request
   * @param {object} data.preference - The preference object containing the schedule and other options
   * @returns {Promise<AxiosResponse<any>>} - A promise that resolves with the response from the URL
   */
  private async getUrlStatus(data: MonitorDto) {
    try {
      const options = this.formUrlOptions(data);
      console.log("'URL Options:', ", options);
      const response = await axios.request(options);
      console.log('Response:', response.status);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        throw error;
      } else {
        console.error('Unexpected error:', error);
        throw error;
      }
    }
  }

  /**
   * * This method is called to format the URL options for the request
   * @param {MonitorDto} data - The data object containing the URL and other parameters
   * @param {string} data.url - The URL to check
   * @param {object} data.params - The parameters for the request
   * @param {object} data.preference - The preference object containing the schedule and other options
   * @returns {AxiosRequestConfig} - The formatted URL options for the request
   */
  private formUrlOptions(data: MonitorDto): AxiosRequestConfig {
    const { url, params, preference } = data;
    const options: AxiosRequestConfig = {
      url: url,
      method: params?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...params?.headers,
      },
      params: params?.query,
      data: params?.body,
      timeout: params?.timeout || 5000,
      maxRedirects: preference?.pauseOnError || 0,
    };
    return options;
  }

  /**
   * * This method is called to format the data to a string
   * @param {any} data - The data object to format
   * @returns {string} - The formatted data string
   */
  private formatDataToString(data: any): string {
    return JSON.stringify(data, null, 2).slice(0, 1000) + '...';
  }

  /**
   * * This method is called to log the error response TO ACTIVITY LOGS TBL
   * @param {Job<MonitorDto>} job - The job object containing the data to process
   * @param {any} error - The error object to log
   * @param {number} responseTime - The response time of the request
   * @returns {ActivityLog} - The activity log object created from the error response
   */
  private logErrorResponse(
    job: Job<MonitorDto>,
    error: any,
    responseTime: number,
  ) {
    const { url, id, userId } = job.data;

    const activityLog = this.activityLogRepo.create({
      metadata: {
        url: url,
        params: job.data.params,
        preference: job.data.preference,
        error: error.message,
        metrics: {
          responseTime: responseTime,
          isError: true,
          isTimeout: error.code === 'ECONNABORTED',
          isNetworkError: error.code === 'ENOTFOUND',
          isUnknownError: error.code === 'ERR_NETWORK',
        },
      },
      user: { id: userId },
      tracker: { id: id },
      type: 'monitoring_error',
      description: `URL ${url} is down.`,
    });

    console.log('Activity Log ERROR OBJECT CREATED:', activityLog);

    return activityLog;
  }

  /**
   * * This method is called to log the success response TO ACTIVITY LOGS TBL
   * @param {Job<MonitorDto>} job - The job object containing the data to process
   * @param {AxiosResponse<any>} statusResponse - The response object from the URL
   * @param {number} responseTime - The response time of the request
   * @returns {ActivityLog} - The activity log object created from the success response
   */
  private logSuccessResponse(
    job: Job<MonitorDto>,
    statusResponse: AxiosResponse<any>,
    responseTime: number,
  ) {
    const { url, id, userId } = job.data;

    const activityLog = this.activityLogRepo.create({
      metadata: {
        url: url,
        params: job.data.params,
        preference: job.data.preference,
        response: {
          data: this.formatDataToString(statusResponse.data),
          headers: statusResponse.headers,
          config: statusResponse.config,
        },
        metrics: {
          responseTime: responseTime,
          statusCode: statusResponse.status,
          statusText: statusResponse.statusText,
          isSecure: statusResponse.request?.res?.socket?.encrypted || false,
          isSuccess:
            statusResponse.request?.res?.statusCode >= 200 &&
            statusResponse.request?.res?.statusCode < 300,
          isRedirect:
            statusResponse.request?.res?.statusCode >= 300 &&
            statusResponse.request?.res?.statusCode < 400,
          isError: statusResponse.request?.res?.statusCode >= 400,
          isTimeout: statusResponse.request?.res?.statusCode === 408,
          isServerError: statusResponse.request?.res?.statusCode >= 500,
          isClientError:
            statusResponse.request?.res?.statusCode >= 400 &&
            statusResponse.request?.res?.statusCode < 500,
          isNetworkError: statusResponse.request?.res?.statusCode === 0,
          isUnknownError: statusResponse.request?.res?.statusCode === -1,
          isUnknown: statusResponse.request?.res?.statusCode === undefined,
          contentLength: parseInt(
            statusResponse.headers['content-length'] || '0',
            10,
          ),
          contentType: statusResponse.headers['content-type'] || 'unknown',
          requestMethod:
            statusResponse.config.method?.toUpperCase() || 'UNKNOWN',
          requestUrl: statusResponse.config.url || 'unknown',
          redirectCount: statusResponse.request?.res?.redirects || 0,
          dnsLookupTime: statusResponse.request?.res?.timingPhases?.dns || 0,
          tcpConnectionTime:
            statusResponse.request?.res?.timingPhases?.tcp || 0,
          firstByteTime:
            statusResponse.request?.res?.timingPhases?.firstByte || 0,
          totalRequestTime:
            statusResponse.request?.res?.timingPhases?.total || 0,
          isCached: statusResponse.request?.res?.fromCache || false,
          isCompressed:
            statusResponse.headers['content-encoding'] === 'gzip' ||
            statusResponse.headers['content-encoding'] === 'deflate',
          server: statusResponse.headers['server'] || 'unknown',
          protocol: statusResponse.request?.res?.socket?.encrypted
            ? 'HTTPS'
            : 'HTTP',
        },
      },
      user: { id: userId },
      tracker: { id: id },
      type: 'monitoring',
      description: `URL ${url} is up with status code ${statusResponse.status}`,
    });

    console.log('Activity Log SUCCESS OBJECT CREATED:', activityLog);

    return activityLog;
  }
}
