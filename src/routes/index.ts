/* eslint-disable @typescript-eslint/no-misused-promises */
import { stateInstance } from '../state';
import type TelegramBot from 'node-telegram-bot-api';
import { botCommands, defaultKeyboard, userKeyboard } from '../constants';
import { AppError, errorHandler } from '../errors';
import { BotController } from '../controllers';
import { userService } from '../services/userService';
import { onCallbackQuery } from './onCallbackQuery';
import { onMessage } from './onMessage';

export { onCallbackQuery } from './onCallbackQuery';
export { onMessage } from './onMessage';

const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands(botCommands);

  bot.onText(/\/set_goal/, (msg) => {
    void bot.sendMessage(msg.chat.id, 'setGoal');
  });

  bot.onText(/\/cancel_action/, (msg) => {
    void bot.sendMessage(msg.chat.id, 'Ok');
  });

  bot.onText(/\/start/, async (msg) => {
    if (msg.from == null) {
      throw new AppError.SystemError('There is no user id');
    }

    const { id, username } = msg.from;

    stateInstance.initUser(id);
    stateInstance.setModeInputLastFM(id);

    const user = await userService.initUser({ id, username });

    const message =
      user?.lastFMUser != null
        ? `Let's do something ${user.lastFMUser.username}`
        : 'Input your lastfm name';

    const keyboard = user.lastFMUser != null ? userKeyboard : defaultKeyboard;

    void bot.sendMessage(msg.chat.id, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...keyboard
    });
  });

  bot.onText(/\/get_friends/, async (msg) => {
    const userId = msg.from?.id;
    if (userId == null) return;
    void bot.sendMessage(msg.chat.id, 'message');
  });

  bot.onText(/\/set_name/, async (msg) => {
    await errorHandler(botController, msg.chat.id)(botController.setName(msg));
  });

  bot.onText(/\/get_recent_tracks/, async (msg) => {
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
