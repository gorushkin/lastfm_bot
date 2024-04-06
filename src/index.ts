import { addRoutes } from './bot';
import { config } from '@/config';
import TelegramBot from 'node-telegram-bot-api';
import schedule from 'node-schedule';
import { dataSource } from './connetctions/data-source';
import { User } from './entity/user';

const { TELEGRAM_API } = config;

const init = async () => {
  try {
    await dataSource.initialize();

    const bot = new TelegramBot(TELEGRAM_API, { polling: true });

    await addRoutes(bot);
  } catch (error) {
    console.log('error: ', error);
  }
};

void init();

// const EVERY_1_SECOND = '*/1 * * * * *';

// schedule.scheduleJob(EVERY_1_SECOND, function () {
//   void user1.updateData();
// });
