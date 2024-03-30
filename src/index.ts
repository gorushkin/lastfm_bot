import { getUserHistory } from './api/api';
import { addRoutes } from './bot';
import { config } from './config/config';
import TelegramBot from 'node-telegram-bot-api';

const { TELEGRAM_API, LAST_FM_API } = config;

const init = () => {
  const bot = new TelegramBot(TELEGRAM_API, { polling: true });

  addRoutes(bot);
};

// init();

const USERNAME = 'deadborn';

void getUserHistory(USERNAME);
