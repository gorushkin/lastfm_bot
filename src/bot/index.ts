/* eslint-disable @typescript-eslint/no-misused-promises */
import { userService } from '@/services/userService';
import { MODE, stateInstance } from '@/state';
import type TelegramBot from 'node-telegram-bot-api';

enum Commands {
  SET_GOAL = 'set_goal',
  GET_FRIENDS = 'get_friends',
  SET_NAME = 'set_name',
  START = 'start',
}
const allCommands = Object.values(Commands);

const addRoutes = async (bot: TelegramBot) => {
  void bot.setMyCommands([
    { command: Commands.SET_GOAL, description: 'Set followed username' },
    { command: Commands.GET_FRIENDS, description: 'Get friends' },
    { command: Commands.SET_NAME, description: 'Set lastfm name' },
    { command: Commands.START, description: 'Start' }
  ]);

  bot.onText(/\/set_goal/, (msg) => {
    void bot.sendMessage(msg.chat.id, 'setGoal');
  });

  bot.onText(/\/start/, async (msg) => {
    if (msg.from == null) return;

    const { id, username } = msg.from;

    try {
      const user = await userService.initUser({ id, username });
      console.log('user: ', user);
    } catch (e) {
      console.log('e: ', e);
    }

    stateInstance.initUser(id);
    stateInstance.setModeInputLastFM(id);

    void bot.sendMessage(msg.chat.id, 'Input your lastfm name');
  });

  bot.onText(/\/get_friends/, async (msg) => {
    const userId = msg.from?.id;
    if (userId == null) return;
    void bot.sendMessage(msg.chat.id, 'message');
  });

  bot.onText(/\/set_name/, (msg) => {
    const userId = msg.from?.id;
    if (userId == null) return;
    void bot.sendMessage(msg.chat.id, 'Input your lastfm name');
  });

  bot.on('message', async (msg) => {
    if (msg.from == null) return;

    const text = msg?.text?.slice(1) as Commands;
    const { id } = msg.from;

    if (allCommands.includes(text)) return;

    const userInfo = stateInstance.getUserInfo(id);

    if (userInfo.screen === MODE.SET_INPUT_NAME) {
      const lastFMUser = msg.text;
      if (lastFMUser === undefined) return;
      const lastFmUser = await userService.setLastFMUser({ id, lastFMUser });
      void bot.sendMessage(msg.chat.id, 'Ok');
      return;
    }

    void bot.sendMessage(msg.chat.id, 'What do you want!!!');
  });
};

export { addRoutes };
