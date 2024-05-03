import { addRoutes } from './routes';
import { config } from './config';
import TelegramBot from 'node-telegram-bot-api';
import { dataSource } from './connections/data-source';

const { TELEGRAM_API } = config;

const init = async () => {
  try {
    await dataSource.initialize();

    const bot = new TelegramBot(TELEGRAM_API, { polling: true });

    await addRoutes(bot);
  } catch (error) {
    console.error(error);
  }
};

void init();

// const EVERY_1_SECOND = '*/1 * * * * *';

// schedule.scheduleJob(EVERY_1_SECOND, function () {
//   void user1.updateData();
// });
