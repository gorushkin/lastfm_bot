import { getFriendsListMessage } from '../libs';
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
        ? keyboard.getLastFMInfoKeyboard(lastfmUsername)
        : keyboard.defaultKeyboard;

    this.state.resetMode(id);

    void this.bot.sendMessage(msg.chat.id, message, keyboards);
  };

  onLastFMInfoCommand = async (msg: TelegramBot.Message) => {
    const username = await userService.getUsername(msg.chat.id);

    await this.getUserRecentTracks(msg, username);
  };

  showLastFMInfo = async (msg: TelegramBot.Message, username: string) => {
    await this.getUserRecentTracks(msg, username);
  };

  getUserRecentTracks = async (msg: TelegramBot.Message, username: string) => {
    const tracks = await userService.getUserRecentTracks(username);

    await this.bot.sendMessage(msg.chat.id, tracks, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...keyboard.getLastFMInfoKeyboard(username)
    });
  };

  onSetNameCommand = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.state.setModeInputUsername(id);
    await this.bot.sendMessage(
      msg.chat.id,
      'Input your lastfm name',
      keyboard.defaultKeyboard
    );
  };

  onFriendsCommand = async (msg: TelegramBot.Message) => {
    await this.initUser(msg);

    this.state.setModeInputFriendName(msg.chat.id);

    const friends = await userService.getUserFriends(msg.chat.id);

    const message = getFriendsListMessage(
      friends.map(({ username }) => username)
    );

    await this.bot.sendMessage(msg.chat.id, message, {
      ...keyboard.getUserFriendsKeyboard(
        friends.map(({ username }) => username)
      ),
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
  };

  cancelActions = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.state.resetMode(id);
    await this.bot.sendMessage(msg.chat.id, 'Ok');
  };

  getUserCurrentTrack = async (msg: TelegramBot.Message, username: string) => {
    const { currentTrackInfo, isPlaying } =
      await userService.getUserCurrentTrack(username);

    const text = isPlaying ? 'Is playing at the moment \n' : '';

    await this.bot.sendMessage(msg.chat.id, `${text}${currentTrackInfo}`, {
      parse_mode: 'HTML',
      ...keyboard.getLastFMInfoKeyboard(username)
    });
  };

  getLastFMFriends = async (msg: TelegramBot.Message, username: string) => {
    const friends = await userService.getUserLastFmFriends(username);

    const message = getFriendsListMessage(friends.map(({ name }) => name));

    void this.bot.sendMessage(msg.chat.id, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...keyboard.getLastFMInfoKeyboard(username)
    });
  };

  showSetFriendUsernameScreen = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    this.state.setModeInputFriendName(id);

    void this.bot.sendMessage(
      msg.chat.id,
      'Input your friend name',
      keyboard.defaultKeyboard
    );
  };

  setFriend = async (msg: TelegramBot.Message) => {
    const id = msg.chat.id;

    const friendName = this.getMessageText(msg);

    this.state.resetMode(id);

    const friend = await userService.addFriend({
      id,
      friendName
    });

    const message = `You added ${friend.username}\n${friend.url}`;

    void this.bot.sendMessage(
      msg.chat.id,
      message,
      keyboard.getLastFMInfoKeyboard(friend.username)
    );
  };

  initUser = async (msg: TelegramBot.Message) => {
    const { id, username } = msg.chat;

    const user = await userService.initUser({ id, username });

    if (user == null) {
      this.state.setModeInputUsername(id);
    }

    return user;
  };

  onStartCommand = async (msg: TelegramBot.Message) => {
    const user = await this.initUser(msg);

    const message =
      user?.lastFMUser != null
        ? `Let's do something ${user.lastFMUser.username}`
        : 'Input your lastfm name';

    const startKeyboard =
      user.lastFMUser != null
        ? keyboard.getLastFMInfoKeyboard(user.lastFMUser.username)
        : keyboard.defaultKeyboard;

    void this.bot.sendMessage(msg.chat.id, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...startKeyboard
    });
  };
}

export { BotController };
