import {
  type SendMessageOptions,
  type InlineKeyboardButton
} from 'node-telegram-bot-api';

export enum Commands {
  SET_NAME = 'set_name',
  START = 'start',
  LASTFM_INFO = 'lastfm_info',
  FRIENDS = 'friends',
}

export enum Buttons {
  GET_LASTFM_FRIENDS = 'get_lastfm_friends',
  GET_RECENT_TRACKS = 'get_recent_tracks',
  GET_CURRENT_TRACK = 'get_current_playing_track',
  LASTFM_PROFILE = 'lastfm_profile',
  CANCEL = 'cancel_action',
  ADD_FRIEND = 'add_friend',
}

export const botCommands = [
  { command: Commands.SET_NAME, description: 'Set username' },
  { command: Commands.START, description: 'Start' },
  { command: Commands.FRIENDS, description: 'Friends' },
  { command: Commands.LASTFM_INFO, description: 'LastFM info' }
];

export const allCommands = Object.values(Commands);

const recentTracksButton: InlineKeyboardButton = {
  text: 'Get recent tracks',
  callback_data: Buttons.GET_RECENT_TRACKS
};

const currentTrackButton: InlineKeyboardButton = {
  text: 'Get current track',
  callback_data: Buttons.GET_CURRENT_TRACK
};

const getUserLinkButton = (username: string): InlineKeyboardButton => ({
  text: 'User profile',
  url: `https://www.last.fm/user/${username}`
});

const getFriendsButton: InlineKeyboardButton = {
  text: 'Get friends',
  callback_data: Buttons.GET_LASTFM_FRIENDS
};

const addFriendButton: InlineKeyboardButton = {
  text: 'Add friend',
  callback_data: Buttons.ADD_FRIEND
};

const cancelButton: InlineKeyboardButton = {
  text: 'Cancel',
  callback_data: Buttons.CANCEL
};

const getKeyboard = (buttons: InlineKeyboardButton[][]) => ({
  inline_keyboard: buttons
});

const getLastFMInfoKeyboard = (username: string): SendMessageOptions => ({
  reply_markup: {
    ...getKeyboard([
      [recentTracksButton, currentTrackButton],
      [getFriendsButton, getUserLinkButton(username)]
    ])
  }
});

const defaultKeyboard: SendMessageOptions = {
  reply_markup: {
    ...getKeyboard([[cancelButton]])
  }
};

const userFriendsKeyboard: SendMessageOptions = {
  reply_markup: {
    ...getKeyboard([[addFriendButton]])
  }
};

export const keyboard = {
  userFriendsKeyboard,
  defaultKeyboard,
  getLastFMInfoKeyboard
};
