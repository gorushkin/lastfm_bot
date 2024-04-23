import {
  type SendMessageOptions,
  type InlineKeyboardButton
} from 'node-telegram-bot-api';

export enum Commands {
  SET_GOAL = 'set_goal',
  GET_FRIENDS = 'get_friends',
  SET_NAME = 'set_name',
  START = 'start',
  GET_RECENT_TRACKS = 'get_recent_tracks',
}

export const allCommands = Object.values(Commands);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const inline_keyboard: InlineKeyboardButton[][] = [
  [
    {
      text: 'Get recent tracks',
      callback_data: Commands.GET_RECENT_TRACKS
    }
  ]
];

export const options: SendMessageOptions = {
  reply_markup: {
    inline_keyboard
  }
};
