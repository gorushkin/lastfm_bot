/* eslint-disable @typescript-eslint/no-misused-promises */
import { MODE, stateInstance } from '../state';
import { type Commands, allCommands, defaultKeyboard } from '../constants';
import { type Message } from 'node-telegram-bot-api';
import { type BotController } from '../controllers';

export { onCallbackQuery } from './onCallbackQuery';

export const onMessage = async (msg: Message, botController: BotController) => {
  stateInstance.getInfo();

  const text = msg?.text?.slice(1) as Commands;
  const id = botController.getMessageId(msg);

  if (allCommands.includes(text)) {
    return;
  }

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
    defaultKeyboard
  );
};
