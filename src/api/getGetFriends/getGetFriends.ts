// https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=rj&api_key=YOUR_API_KEY&format=json
import axios from 'axios';
import { getUrl, Method, type Response } from '../config';
import { type GetGetFriendsResponse } from '../getRecentTracks/types';

const getGetFriendsUrl = (user: string) =>
  getUrl(user, Method.GET_FRIENDS);

export const getGetFriendsRequest = async (
  username: string
): Promise<Response<GetGetFriendsResponse>> => {
  try {
    const response = await axios<GetGetFriendsResponse>(
      getGetFriendsUrl(username)
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error };
  }
};
