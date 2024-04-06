// https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=rj&api_key=YOUR_API_KEY&format=json
import axios from 'axios';
import { type GetRecentTracksResponse } from '../getGetFriends/types';
import { getUrl, Method, type Response } from '../config';

const getRecentTracksUrl = (user: string) =>
  getUrl(user, Method.GET_RECENT_TRACKS);

export const getRecentTracks = async (
  username: string
): Promise<Response<GetRecentTracksResponse>> => {
  try {
    const response = await axios<GetRecentTracksResponse>(
      getRecentTracksUrl(username)
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error };
  }
};
