import { keyboard } from '../constants';
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

  setUser = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    const lastfmUsername = this.getMessageText(msg);

    const updatedUser = await userService.setUser({
      id,
      lastfmUsername
    });

    const message =
      updatedUser?.lastFMUser != null
        ? `Your lastFm name is ${updatedUser.lastFMUser.username}\n${updatedUser.lastFMUser.url}`
        : 'Press /start to input your lastfm name';

    const keyboards =
      updatedUser.lastFMUser != null
        ? keyboard.lastFMInfoKeyboard
        : keyboard.defaultKeyboard;

    this.state.setModeNone(id);

    void this.bot.sendMessage(msg.chat.id, message, keyboards);
  };

  getUserRecentTracks = async (msg: TelegramBot.Message) => {
    const tracks = await userService.getUserRecentTracks(msg.chat.id);

    void this.bot.sendMessage(msg.chat.id, tracks, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...keyboard.lastFMInfoKeyboard
    });
  };

  setUsername = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.state.setModeInputLastFM(id);
    void this.bot.sendMessage(
      msg.chat.id,
      'Input your lastfm name',
      keyboard.defaultKeyboard
    );
  };

  getFriends = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.state.setModeInputLastFM(id);
    void this.bot.sendMessage(
      msg.chat.id,
      'I will show your friends here',
      keyboard.userFriendsKeyboard
    );
  };

  cancelActions = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.state.resetMode(id);
    void this.bot.sendMessage(msg.chat.id, 'Ok');
  };

  getUserCurrentTrack = async (msg: TelegramBot.Message) => {
    const { currentTrackInfo, isPlaying } =
      await userService.getUserCurrentTrack(msg.chat.id);

    const text = isPlaying ? 'Is playing at the moment \n' : '';

    void this.bot.sendMessage(msg.chat.id, `${text}${currentTrackInfo}`, {
      parse_mode: 'HTML',
      ...keyboard.lastFMInfoKeyboard
    });
  };

  getLastFMFriends = async (msg: TelegramBot.Message) => {
    const friends = await userService.getUserFriends(msg.chat.id);

    const friendsList = friends
      .map(
        ({ name }) => `<a href="https://www.last.fm/user/${name}">${name}</a>`
      )
      .join('\n');

    const message = `Your lastfm friends \n${friendsList}`;

    void this.bot.sendMessage(msg.chat.id, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...keyboard.lastFMInfoKeyboard
    });
  };
}

export { BotController };
