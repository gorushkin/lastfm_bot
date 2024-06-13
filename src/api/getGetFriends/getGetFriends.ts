// https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=rj&api_key=YOUR_API_KEY&format=json
import axios from 'axios';
import { getUrl, Method } from '../config';
import { type GetGetFriendsResponse } from '../getRecentTracks/types';
import { AppError } from '../../errors';

const getGetFriendsUrl = (user: string) => getUrl(user, Method.GET_FRIENDS);

export const getGetFriendsRequest = async (
  username: string
): Promise<GetGetFriendsResponse> => {
  try {
    const response = await axios<GetGetFriendsResponse>(
      getGetFriendsUrl(username)
    );

    return response.data;
  } catch (error) {
    throw new AppError.LastFm();
  }
};
