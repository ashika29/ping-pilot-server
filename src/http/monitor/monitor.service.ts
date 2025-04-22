import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { InjectQueue } from '@nestjs/bull';
import Bull, { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Tracker } from 'src/model/tracker.model';
import { MonitorDto } from 'src/common/dto/monitor.dto';
import { ActivityLog } from 'src/model/activity-logs.model';

@Injectable()
export class MonitorService {
  private jobs: Map<number, CronJob> = new Map();

  constructor(
    @InjectQueue('monitor-queue') private queue: Queue<MonitorDto>,
    @InjectRepository(Tracker) private trackerRepo: Repository<Tracker>,
    @InjectRepository(ActivityLog)
    private activityLogRepo: Repository<ActivityLog>,
  ) {}

  /**
   * * This method is called to add or update a cron job for a tracker
   * @param {Tracker} tracker - The tracker object containing the URL and other parameters
   * @param {string} tracker.url - The URL to check
   * @param {string} tracker.user.email - The email of the user to notify
   * @param {object} tracker.params - The parameters for the request
   * @param {object} tracker.preference - The preference object containing the schedule and other options
   * @param {number} tracker.user.id - The ID of the user to notify
   * @param {number} tracker.id - The ID of the tracker
   * @returns {Promise<void>} - A promise that resolves when the job is added or updated
   * @throws {Error} - Throws an error if the tracker is not found or if the job fails to start
   */
  async addOrUpdateCronJob(tracker: Tracker): Promise<void> {
    console.log('Inside addorupate:', { tracker });

    const existingJob = this.jobs.get(tracker.id);

    if (existingJob) {
      await existingJob.stop();
    }

    if (tracker.preference?.schedule) {
      const job = new CronJob(tracker.preference.schedule, async () => {
        console.log('[CRON] Running job for tracker:', tracker.id);
        console.log('[CRON] Running job for tracker URL:', tracker.url);
        console.log('[CRON] Running job for tracker params:', tracker.params);
        console.log(
          '[CRON] Running job for tracker preference:',
          tracker.preference,
        );
        console.log(
          '[CRON] Running job for tracker user email:',
          tracker.user.email,
        );
        console.log('[CRON] Running job for tracker user id:', tracker.user.id);
        await this.runAJob(tracker);
      });

      job.start();
      this.jobs.set(tracker.id, job);
    } else {
      console.log('Running check for tracker:', tracker.id);
      console.log('Running check for tracker URL:', tracker.url);
      await this.runAJob(tracker);
      // Since this is an on demand job, we don't need to keep it in the jobs map
      // We do not need it to be active once run, hence we are soft deleting the tracker
      await this.trackerRepo.update(tracker.id, { is_active: false });
      await this.removeCronJob(tracker.id);
      console.log(
        'Tracker has successfully run once & is not active anymore:',
        tracker.id,
      );
    }
  }

  /**
   * * This method is called by the cron job to run a job
   * @param {Tracker} tracker - The tracker object containing the URL and other parameters
   * @param {string} tracker.url - The URL to check
   * @param {string} tracker.user.email - The email of the user to notify
   * @param {object} tracker.params - The parameters for the request
   * @param {object} tracker.preference - The preference object containing the schedule and other options
   * @param {number} tracker.user.id - The ID of the user to notify
   * @param {number} tracker.id - The ID of the tracker
   * @returns {Promise<Bull.Job<MonitorDto>>} - The job object created by the queue
   */
  async runAJob(tracker: Tracker): Promise<Bull.Job<MonitorDto>> {
    console.log('Running job for tracker:', tracker.id);
    const checkUrlJob = await this.queue.add('check-url', {
      id: tracker.id,
      url: tracker.url,
      email: tracker.user.email,
      params: tracker.params,
      preference: tracker.preference,
      userId: tracker.user.id,
    });
    console.log({
      checkUrlJob: checkUrlJob.data,
      checkUrlJobId: checkUrlJob.id,
    });
    return checkUrlJob;
  }

  /**
   * * This method is called to remove a cron job
   * @param {number} trackerId - The ID of the tracker to remove the cron job for
   */
  async removeCronJob(trackerId: number) {
    const job = this.jobs.get(trackerId);

    if (job) {
      await job.stop();
      this.jobs.delete(trackerId);
    }
  }

  /**
   * * This method is called to initialize all cron jobs for active trackers
   * @returns {Promise<void>}
   */
  async initializeJobs(): Promise<void> {
    console.log('Initialising jobs');
    const trackers = await this.trackerRepo.find({
      where: { is_active: true, preference: Not(IsNull()) },
      relations: ['user'],
    });

    for (const tracker of trackers) {
      await this.addOrUpdateCronJob(tracker);
    }
  }

  /**
   * * This method is called when the module is initialized (automatically called by NestJS)
   * * It initializes all cron jobs for active trackers
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    await this.initializeJobs();
  }
}
