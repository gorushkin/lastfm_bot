import axios from 'axios';
import { getUrl, Method } from '../config';
import { type GetGetUserInfoResponse } from './types';
import { AppError } from '../../errors';

const getGetUserInfoUrl = (user: string) => getUrl(user, Method.GET_USER_INFO);

export const getUserInfo = async (
  username: string
): Promise<GetGetUserInfoResponse> => {
  const url = getGetUserInfoUrl(username);

  try {
    const response = await axios<GetGetUserInfoResponse>(url);

    return response.data;
  } catch (error) {
    throw new AppError.LastFm();
  }
};
