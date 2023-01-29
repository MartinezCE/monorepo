/* eslint-disable global-require */
import AWS from 'aws-sdk';
import logger from '../helpers/logger';

const loggerInstance = logger('email-service');

AWS.config.update({ region: process.env.AWS_REGION });

const isProd = process.env.NODE_ENV !== 'development';
const DEFAULT_CC = isProd ? (process.env.DEFAULT_EMAIL_CC || '').split(', ').filter(el => !!el) : [];
const DEFAULT_FROM = 'Equipo de Wimet <info@wimet.co>';

type Templates = 'client_invitation' | 'password_recovery';

class EmailService {
  instance: AWS.SES;

  constructor() {
    this.instance = new AWS.SES({
      apiVersion: '2010-12-01',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(template: Templates, data: Record<string, any>, to: string[], from = DEFAULT_FROM, cc = DEFAULT_CC) {
    try {
      await this.instance
        .sendTemplatedEmail({
          Destination: { ToAddresses: to, CcAddresses: cc },
          Source: from,
          Template: template,
          TemplateData: JSON.stringify(data),
        })
        .promise();
      loggerInstance.info(`AWS template email ${template} sended successfully`);
    } catch (error) {
      loggerInstance.error(`There was an error sending AWS template email ${template}`);
      throw error;
    }
  }
}

export default new EmailService();
