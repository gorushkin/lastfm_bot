import { dataSource } from '../connections/data-source';
import { User } from '../entity/user';
import { AppError } from '../errors';
import { type Repository } from 'typeorm';
import { lastFMService } from './lastFMService';
import { lastFMApiService } from './lastFMApiService';

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

  getUserRecentTracks = async (id: number) => {
    const username = await this.getUsername(id);

    return await lastFMApiService.getUserRecentTracks(username);
  };

  getUserCurrentTrack = async (id: number) => {
    const username = await this.getUsername(id);

    return await lastFMApiService.getUserCurrentTrack(username);
  };

  getUserLastFmFriends = async (id: number) => {
    const username = await this.getUsername(id);

    return await lastFMApiService.getUserFriends(username);
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
