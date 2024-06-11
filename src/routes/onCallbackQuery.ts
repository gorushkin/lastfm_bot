/* eslint-disable @typescript-eslint/no-misused-promises */
import type TelegramBot from 'node-telegram-bot-api';
import {
  Commands,
  defaultKeyboard
} from '../constants';
import { AppError } from '../errors';
import { type BotController } from '../controllers';

export const onCallbackQuery = async (
  msg: TelegramBot.CallbackQuery,
  botController: BotController
) => {
  if (msg.message == null) {
    throw new AppError.SystemError('Message not found');
  }

  if (msg.data === Commands.GET_RECENT_TRACKS) {
    await botController.getUserRecentTracks(msg.message);
    return;
  }

  if (msg.data === Commands.GET_CURRENT_TRACK) {
    await botController.getUserCurrentTrack(msg.message);
    return;
  }

  if (msg.data === Commands.CANCEL) {
    await botController.cancelActions(msg.message);
    return;
  }

  void botController.bot.sendMessage(
    msg.from.id,
    'What do you want!!!',
    defaultKeyboard
  );
};
