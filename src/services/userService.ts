import { dataSource } from '../connections/data-source';
import { User } from '../entity/user';
import { AppError } from '../errors';
import { type Repository } from 'typeorm';
import { lastFMService } from './lastFMService';
import { lastFMAPIService } from './lastFMAPIService';

class UserService {
  repo: Repository<User>;

  constructor () {
    this.repo = dataSource.getRepository(User);
  }

  getUsername = async (id: number) => {
    const user = await this.findUser(id);

    if (user === null) {
      throw new AppError.User();
    }

    if (user.lastFMUser == null) {
      throw new AppError.LastFm('You have no lastfm username');
    }

    return user.lastFMUser.username;
  };

  findUser = async (id: number) => {
    return await this.repo.findOne({
      where: { id },
      relations: { lastFMUser: true }
    });
  };

  setUser = async ({
    id,
    lastfmUsername
  }: {
    id: number;
    lastfmUsername: string;
  }) => {
    const user = await this.findUser(id);

    if (user === null) {
      throw new AppError.User();
    }

    const lastFmUser = await lastFMService.getUser(lastfmUsername);

    user.lastFMUser = lastFmUser;
    await this.repo.save(user);
    return user;
  };

  createUser = async (id: number, username?: string) => {
    const user = new User();
    user.id = id;
    user.username = username ?? '';
    await this.repo.save(user);
    return user;
  };

  initUser = async ({ id, username }: { id: number; username?: string }) => {
    const user = await this.findUser(id);

    if (user === null) {
      return await this.createUser(id, username);
    }

    return user;
  };

  getConvertedTracks = (
    tracks: Array<{
      artist: string;
      name: string;
      album: string;
      url: string;
    }>,
    length: number
  ) => {
    return tracks
      .slice(0, length)
      .map((item) => `<a href="${item.url}">${item.artist}: ${item.name}</a>`)
      .join('\n');
  };

  getUserRecentTracks = async (id: number) => {
    const tracks = await this.getUserTracks(id);

    return this.getConvertedTracks(tracks, 10);
  };

  getUserCurrentTrack = async (id: number) => {
    const tracks = await this.getUserTracks(id);

    const isPlaying = tracks[0].attr?.nowplaying === 'true';

    return { currentTrackInfo: this.getConvertedTracks(tracks, 1), isPlaying };
  };

  getUserTracks = async (id: number) => {
    const username = await this.getUsername(id);

    return await lastFMAPIService.getUserTracks(username);
  };

  getUserFriends = async (id: number) => {
    const username = await this.getUsername(id);

    return await lastFMAPIService.getUserFriends(username);
  };

  addFriend = async ({
    friendName,
    id
  }: {
    id: number;
    friendName: string;
  }) => {
    const user = await this.findUser(id);

    if (user === null) {
      throw new AppError.User();
    }

    const friend = await lastFMService.getUser(friendName);

    user.friends.push(friend);

    await this.repo.save(user);

    return friend;
  };
}

export const userService = new UserService();
