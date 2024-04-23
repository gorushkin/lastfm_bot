import { type Commands, allCommands, options } from '@/constants';
import { AppError } from '@/errors';
import { userService } from '@/services/userService';
import { MODE, stateInstance } from '@/state';
import type TelegramBot from 'node-telegram-bot-api';

class BotController {
  bot: TelegramBot;

  init (bot: TelegramBot) {
    this.bot = bot;
  }

  constructor (bot: TelegramBot) {
    this.init(bot);
  }

  getMessageText = (msg: TelegramBot.Message) => {
    const username = msg.text;

    if (username === undefined) {
      throw new AppError.Validation('You should write your lastfm username');
    }

    return username;
  };

  setLastFmUser = async (msg: TelegramBot.Message) => {
    if (this.bot == null) return;
    const id = this.getMessageId(msg);

    const lastfmUsername = this.getMessageText(msg);

    const updatedUser = await userService.setLastFMUser({
      id,
      lastfmUsername
    });

    stateInstance.setModeNone(id);

    void this.bot.sendMessage(
      msg.chat.id,
      `Your lastFm suer is ${updatedUser.lastFMUser.username}\n${updatedUser.lastFMUser.url}`
    );
  };

  getMessageId = (msg: TelegramBot.Message) => {
    if (msg.from == null) {
      throw new AppError('There is no user id');
    }

    return msg.from.id;
  };

  getUserRecentTracks = async (msg: TelegramBot.Message) => {
    if (this.bot == null) {
      throw new AppError('Bot is not initialized');
    }

    const tracks = await userService.getUserRecentTracks(msg.chat.id);

    void this.bot.sendMessage(msg.chat.id, tracks, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...options
    });
  };

  setName = async (msg: TelegramBot.Message) => {
    if (this.bot == null) {
      throw new AppError('Bot is not initialized');
    }

    const userId = msg.from?.id;
    if (userId == null) return;
    stateInstance.setModeInputLastFM(userId);
    void this.bot.sendMessage(msg.chat.id, 'Input your lastfm name');
  };
}

export { BotController };
