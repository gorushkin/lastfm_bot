import axios, { isAxiosError } from 'axios';
import { getUrl, Method, type Response } from '../config';
import { type GetGetUserInfoResponse } from './types';

const getGetUserInfoUrl = (user: string) => getUrl(user, Method.GET_USER_INFO);

export const getUserInfo = async (
  username: string
): Promise<Response<GetGetUserInfoResponse>> => {
  const url = getGetUserInfoUrl(username);

  try {
    const response = await axios<GetGetUserInfoResponse>(url);
    console.log('response: ', response);

    return { ok: true, data: response.data };
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response);
    }
    return { ok: false, error };
  }
};
