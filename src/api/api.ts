// https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=rj&api_key=YOUR_API_KEY&format=json
import axios from 'axios';
import { config } from '../config/config';
import { type HistoryResponse } from './types';

const { LAST_FM_API } = config;

const getUrl = (user: string) =>
  `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LAST_FM_API}&format=json`;

export const getUserHistory = async (username: string) => {
  try {
    console.log(getUrl(username));
    const response = await axios<HistoryResponse>(getUrl(username));

    const recentItem = response.data.recenttracks.track[0];
  } catch (error) {}
};
