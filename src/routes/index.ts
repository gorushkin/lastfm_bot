/* eslint-disable @typescript-eslint/no-misused-promises */
import { MODE, stateInstance } from '../state';
import type TelegramBot from 'node-telegram-bot-api';
import { Commands, allCommands, options } from '../constants';
import { AppError, errorHandler } from '../errors';
import { type Message } from 'node-telegram-bot-api';
import { BotController } from '../controllers';

const onCallbackQuery = async (
  msg: TelegramBot.CallbackQuery,
  botController: BotController
) => {
  if (msg.message == null) {
    throw new AppError('Message not found');
  }

  if (msg.data === Commands.GET_RECENT_TRACKS) {
    await botController.getUserRecentTracks(msg.message);
    return;
  }

  void botController.bot.sendMessage(
    msg.from.id,
    'What do you want!!!',
    options
  );
};

const onMessage = async (msg: Message, botController: BotController) => {
  stateInstance.getInfo();

  const text = msg?.text?.slice(1) as Commands;
  const id = botController.getMessageId(msg);

  if (allCommands.includes(text)) return;

  const userInfo = stateInstance.getUserInfo(id);

  if (userInfo.screen === MODE.SET_INPUT_NAME) {
    await botController.setLastFmUser(msg);
    return;
  }

  if (userInfo.screen === MODE.GET_RECENT_TRACKS) {
    await botController.setLastFmUser(msg);
    return;
  }

  void botController.bot.sendMessage(
    msg.chat.id,
    'What do you want!!!',
    options
  );
};

const addRoutes = async (bot: TelegramBot) => {
  const botController = new BotController(bot);

  void bot.setMyCommands([
    { command: Commands.SET_GOAL, description: 'Set followed username' },
    { command: Commands.GET_FRIENDS, description: 'Get friends' },
    { command: Commands.SET_NAME, description: 'Set lastfm name' },
    { command: Commands.START, description: 'Start' },
    {
      command: Commands.GET_RECENT_TRACKS,
      description: 'Get user resent tracks'
    }
  ]);

  bot.onText(/\/set_goal/, (msg) => {
    void bot.sendMessage(msg.chat.id, 'setGoal');
  });

  bot.onText(/\/start/, async (msg) => {
    if (msg.from == null) return;

    const { id } = msg.from;

    stateInstance.initUser(id);
    stateInstance.setModeInputLastFM(id);

    void bot.sendMessage(msg.chat.id, 'Input your lastfm name');
  });

  bot.onText(/\/get_friends/, async (msg) => {
    const userId = msg.from?.id;
    if (userId == null) return;
    void bot.sendMessage(msg.chat.id, 'message');
  });

  bot.onText(/\/set_name/, async (msg) => {
    await errorHandler(botController.setName(msg));
  });

  bot.onText(/\/get_recent_tracks/, async (msg) => {
    await errorHandler(botController.getUserRecentTracks(msg));
  });

  bot.on('callback_query', async (msg) => {
    await errorHandler(onCallbackQuery(msg, botController));
  });

  bot.on('message', async (msg) => {
    await errorHandler(onMessage(msg, botController));
  });
};

export { addRoutes };
