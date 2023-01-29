import { CronJob } from 'cron';
import logger from '../helpers/logger';
import WimetBillsService from './wimet-bills';
// import PlanRenovationService from './plan-renovation';
import GoogleCalendarService from './google-calendar';

class CronService {
  cronMonthly: CronJob;

  cronDaily: CronJob;

  constructor() {
    logger('CronService').info('Starting cron.');
    this.cronMonthly = new CronJob('0 0 0 1 * *', this.monthlyRun, null, true, 'UTC');
    this.cronDaily = new CronJob('0 0 0 * * *', this.dailyRun, null, true, 'UTC');

    this.instantRun();
  }

  private instantRun = async () => {
    try {
      logger('CronService').info('Running instant sync...');
      // await PlanRenovationService.createMissingRenovations();
      // await PlanRenovationService.updateUnusedCredits();
      await GoogleCalendarService.refreshWebhooks();
      logger('CronService').info('Successfully ran instant sync.');
    } catch (e) {
      logger('CronService').error('Error running instant sync', e);
    }
  };

  private dailyRun = async () => {
    try {
      logger('CronService').info('Running daily cron...');
      // await PlanRenovationService.createMissingRenovations();
      // await PlanRenovationService.updateUnusedCredits();
      await GoogleCalendarService.refreshWebhooks();
      logger('CronService').info('Successfully ran daily cron.');
    } catch (e) {
      logger('CronService').error('Error running daily cron', e);
    }
  };

  private monthlyRun = async () => {
    try {
      logger('CronService').info('Running monthly cron...');
      await WimetBillsService.createMonthlyBill();
      logger('CronService').info('Successfully ran monthly cron.');
    } catch (e) {
      logger('CronService').error('Error running monthly cron', e);
    }
  };
}

export default new CronService();
