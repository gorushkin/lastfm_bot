/* eslint-disable @typescript-eslint/no-misused-promises */
import type TelegramBot from 'node-telegram-bot-api';
import { Commands, botCommands } from '../constants';
import { errorHandler } from '../errors';
import { BotController } from '../controllers';
import { onCallbackQuery } from './onCallbackQuery';
import { onMessage } from './onMessage';

export { onCallbackQuery } from './onCallbackQuery';
export { onMessage } from './onMessage';

const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands(botCommands);

  bot.onText(new RegExp(`/${Commands.START}`), async (msg) => {
    await errorHandler(
      botController,
      msg.chat.id
    )(botController.onStartCommand(msg));
  });

  bot.onText(new RegExp(`/${Commands.FRIENDS}`), async (msg) => {
    await errorHandler(
      botController,
      msg.chat.id
    )(botController.onFriendsCommand(msg));
  });

  bot.onText(new RegExp(`/${Commands.SET_NAME}`), async (msg) => {
    await errorHandler(
      botController,
      msg.chat.id
    )(botController.onSetNameCommand(msg));
  });

  bot.onText(new RegExp(`/${Commands.LASTFM_INFO}`), async (msg) => {
    await errorHandler(
      botController,
      msg.chat.id
    )(botController.getUserRecentTracks(msg));
  });

  bot.on('callback_query', async (msg) => {
    await errorHandler(
      botController,
      msg.from.id
    )(onCallbackQuery(msg, botController));
  });

  bot.on('message', async (msg) => {
    await errorHandler(
      botController,
      msg.chat.id
    )(onMessage(msg, botController));
  });
};

export { addRoutes };
