/* eslint-disable @typescript-eslint/no-misused-promises */
import type TelegramBot from 'node-telegram-bot-api';
import { Buttons, keyboard } from '../constants';
import { AppError } from '../errors';
import { type BotController } from '../controllers';

const parseQuery = (query: string) => {
  const [command, value] = query.split('/');
  return { command, value };
};

export const onCallbackQuery = async (
  msg: TelegramBot.CallbackQuery,
  botController: BotController
) => {
  const data = msg.data;

  if (msg.message == null || data == null) {
    throw new AppError.SystemError('Message not found');
  }

  const { command, value } = parseQuery(data);

  if (command === Buttons.GET_RECENT_TRACKS) {
    await botController.getUserRecentTracks(msg.message, value);
    return;
  }

  if (command === Buttons.GET_CURRENT_TRACK) {
    await botController.getUserCurrentTrack(msg.message, value);
    return;
  }

  if (command === Buttons.GET_LASTFM_FRIENDS) {
    await botController.getLastFMFriends(msg.message, value);
    return;
  }

  if (command === Buttons.ADD_FRIEND) {
    await botController.showSetFriendUsernameScreen(msg.message);
    return;
  }

  if (command === Buttons.GET_USER) {
    await botController.showLastFMInfo(msg.message, value);
    return;
  }

  if (command === Buttons.CANCEL) {
    await botController.cancelActions(msg.message);
    return;
  }

  void botController.bot.sendMessage(
    msg.from.id,
    'What do you want!!!',
    keyboard.defaultKeyboard
  );
};
