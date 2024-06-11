import { defaultKeyboard, userKeyboard } from '../constants';
import { AppError } from '../errors';
import { userService } from '../services/userService';
import { stateInstance } from '../state';
import type TelegramBot from 'node-telegram-bot-api';

class BotController {
  bot: TelegramBot;
  state = stateInstance;

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
    const id = this.getMessageId(msg);

    const lastfmUsername = this.getMessageText(msg);

    const updatedUser = await userService.setLastFMUser({
      id,
      lastfmUsername
    });

    const message =
      updatedUser?.lastFMUser != null
        ? `Your lastFm name is ${updatedUser.lastFMUser.username}\n${updatedUser.lastFMUser.url}`
        : 'Press /start to input your lastfm name';

    const keyboard =
      updatedUser.lastFMUser != null ? userKeyboard : defaultKeyboard;

    this.state.setModeNone(id);

    void this.bot.sendMessage(msg.chat.id, message, keyboard);
  };

  getMessageId = (msg: TelegramBot.Message) => {
    if (msg.from == null) {
      throw new AppError('There is no user id');
    }

    return msg.from.id;
  };

  getUserRecentTracks = async (msg: TelegramBot.Message) => {
    const tracks = await userService.getUserRecentTracks(msg.chat.id);

    void this.bot.sendMessage(msg.chat.id, tracks, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...userKeyboard
    });
  };

  setName = async (msg: TelegramBot.Message) => {
    const userId = msg.from?.id;
    if (userId == null) {
      throw new AppError.SystemError('There is no user id');
    }
    this.state.setModeInputLastFM(userId);
    void this.bot.sendMessage(msg.chat.id, 'Input your lastfm name', defaultKeyboard);
  };

  cancelActions = async (msg: TelegramBot.Message) => {
    const userId = msg.from?.id;
    if (userId == null) return;
    this.state.resetMode(userId);
    void this.bot.sendMessage(msg.chat.id, 'Ok');
  };

  getUserCurrentTrack = async (msg: TelegramBot.Message) => {
    const { currentTrackInfo, isPlaying } =
      await userService.getUserCurrentTrack(msg.chat.id);

    const text = isPlaying ? 'Is playing at the moment \n' : '';

    void this.bot.sendMessage(msg.chat.id, `${text}${currentTrackInfo}`, {
      parse_mode: 'HTML',
      ...userKeyboard
    });
  };
}

export { BotController };
