/* eslint-disable @typescript-eslint/no-misused-promises */
import { stateInstance } from '../state';
import type TelegramBot from 'node-telegram-bot-api';
import {
  Commands,
  botCommands,
  keyboard
} from '../constants';
import { errorHandler } from '../errors';
import { BotController } from '../controllers';
import { userService } from '../services/userService';
import { onCallbackQuery } from './onCallbackQuery';
import { onMessage } from './onMessage';

export { onCallbackQuery } from './onCallbackQuery';
export { onMessage } from './onMessage';

const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands(botCommands);

  bot.onText(new RegExp(`/${Commands.START}`), async (msg) => {
    const { id, username } = msg.chat;

    stateInstance.initUser(id);
    stateInstance.setModeInputLastFM(id);

    const user = await userService.initUser({ id, username });

    const message =
      user?.lastFMUser != null
        ? `Let's do something ${user.lastFMUser.username}`
        : 'Input your lastfm name';

    const startKeyboard =
      user.lastFMUser != null ? keyboard.lastFMInfoKeyboard : keyboard.defaultKeyboard;

    void bot.sendMessage(msg.chat.id, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...startKeyboard
    });
  });

  bot.onText(new RegExp(`/${Commands.FRIENDS}`), async (msg) => {
    await errorHandler(
      botController,
      msg.chat.id
    )(botController.getFriends(msg));
  });

  bot.onText(new RegExp(`/${Commands.SET_NAME}`), async (msg) => {
    await errorHandler(botController, msg.chat.id)(botController.setUsername(msg));
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
