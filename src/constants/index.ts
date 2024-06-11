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
  GET_CURRENT_TRACK = 'get_current_playing_track',
  CANCEL = 'cancel_action',
}

export const botCommands = [
  { command: Commands.SET_NAME, description: 'Set LastFM username' },
  { command: Commands.START, description: 'Start' }
];

export const allCommands = Object.values(Commands);

const recentTracksButton: InlineKeyboardButton = {
  text: 'Get recent tracks',
  callback_data: Commands.GET_RECENT_TRACKS
};

const currentTrackButton: InlineKeyboardButton = {
  text: 'Get current track',
  callback_data: Commands.GET_CURRENT_TRACK
};

const cancelButton: InlineKeyboardButton = {
  text: 'Cancel',
  callback_data: Commands.CANCEL
};

const getKeyboard = (buttons: InlineKeyboardButton[]) => ({
  inline_keyboard: [buttons]
});

export const userKeyboard: SendMessageOptions = {
  reply_markup: {
    ...getKeyboard([recentTracksButton, currentTrackButton])
  }
};

export const defaultKeyboard: SendMessageOptions = {
  reply_markup: {
    ...getKeyboard([cancelButton])
  }
};
