/* eslint-disable @typescript-eslint/no-misused-promises */
import { stateInstance } from '../state';
import { type Commands, allCommands, keyboard } from '../constants';
import { type Message } from 'node-telegram-bot-api';
import { type BotController } from '../controllers';
import { userService } from '../services/userService';

export { onCallbackQuery } from './onCallbackQuery';

export const onMessage = async (msg: Message, botController: BotController) => {
  const text = msg?.text?.slice(1) as Commands;
  const id = msg.chat.id;

  const username = msg.from?.username;

  await userService.initUser({ id, username });

  if (allCommands.includes(text)) {
    return;
  }

  const { isModeInputFriendName, isModeInputName } =
  stateInstance.getUserInfo(id);

  if (isModeInputName) {
    await botController.setUser(msg);
    return;
  }

  if (isModeInputFriendName) {
    await botController.setFriend(msg);
    return;
  }

  void botController.bot.sendMessage(
    msg.chat.id,
    'What do you want!!!',
    keyboard.defaultKeyboard
  );
};
