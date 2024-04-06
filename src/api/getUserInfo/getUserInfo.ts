import axios from 'axios';
import { getUrl, Method, type Response } from '../config';
import { type GetGetUserInfoResponse } from './types';

const getGetUserInfoUrl = (user: string) =>
  getUrl(user, Method.GET_USER_INFO);

export const getUserInfo = async (
  username: string
): Promise<Response<GetGetUserInfoResponse>> => {
  try {
    const response = await axios<GetGetUserInfoResponse>(
      getGetUserInfoUrl(username)
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error };
  }
};
