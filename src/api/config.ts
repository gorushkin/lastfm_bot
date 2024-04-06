import { config } from '../config';

export const baseUrl = 'https://ws.audioscrobbler.com/2.0/';

const { LAST_FM_API } = config;

export enum Method {
  GET_RECENT_TRACKS = 'user.getrecenttracks',
  GET_FRIENDS = 'user.getfriends',
  GET_USER_INFO = 'user.getinfo',
}

export type Response<T> = { ok: true; data: T } | { ok: false; error: unknown };

export const getUrl = (user: string, method: string) => {
  return `${baseUrl}?method=${method}&user=${user}&api_key=${LAST_FM_API}&format=json`;
};
