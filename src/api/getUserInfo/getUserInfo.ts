import axios, { isAxiosError } from 'axios';
import { getUrl, Method, type Response } from '../config';
import { type GetGetUserInfoResponse } from './types';
import { AppError } from '@/errors';

type ErrorResponse = {
  message: string;
  error: number;
};

const getGetUserInfoUrl = (user: string) => getUrl(user, Method.GET_USER_INFO);

export const getUserInfo = async (
  username: string
): Promise<Response<GetGetUserInfoResponse>> => {
  const url = getGetUserInfoUrl(username);
  console.log('url: ', url);

  try {
    const response = await axios<GetGetUserInfoResponse>(url);

    return response.data;
  } catch (error) {
    throw new AppError.LastFmError();
  }
};
