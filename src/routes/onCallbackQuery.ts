/* eslint-disable @typescript-eslint/no-misused-promises */
import type TelegramBot from 'node-telegram-bot-api';
import { Buttons, keyboard } from '../constants';
import { AppError } from '../errors';
import { type BotController } from '../controllers';

export const onCallbackQuery = async (
  msg: TelegramBot.CallbackQuery,
  botController: BotController
) => {
  if (msg.message == null) {
    throw new AppError.SystemError('Message not found');
  }

  if (msg.data === Buttons.GET_RECENT_TRACKS) {
    await botController.getUserRecentTracks(msg.message);
    return;
  }

  if (msg.data === Buttons.GET_CURRENT_TRACK) {
    await botController.getUserCurrentTrack(msg.message);
    return;
  }

  if (msg.data === Buttons.GET_LASTFM_FRIENDS) {
    await botController.getLastFMFriends(msg.message);
    return;
  }

  if (msg.data === Buttons.ADD_FRIEND) {
    await botController.showSetFriendUsernameScreen(msg.message);
    return;
  }

  if (msg.data === Buttons.CANCEL) {
    await botController.cancelActions(msg.message);
    return;
  }

  void botController.bot.sendMessage(
    msg.from.id,
    'What do you want!!!',
    keyboard.defaultKeyboard
  );
};
