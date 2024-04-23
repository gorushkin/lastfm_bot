// https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=rj&api_key=YOUR_API_KEY&format=json
import axios from 'axios';
import { type GetRecentTracksResponse } from '../getGetFriends/types';
import { getUrl, Method } from '../config';
import { AppError } from '@/errors';

const getRecentTracksUrl = (user: string) =>
  getUrl(user, Method.GET_RECENT_TRACKS);

export const getRecentTracks = async (
  username: string
): Promise<GetRecentTracksResponse> => {
  const url = getRecentTracksUrl(username);

  try {
    const response = await axios<GetRecentTracksResponse>(url);

    return response.data;
  } catch (error) {
    throw new AppError.LastFm();
  }
};
