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

  getUser = async (id: number) => {
    const user = await this.findUser(id);

    if (user === null) {
      throw new AppError.User();
    }

    return user;
  };

  getUsername = async (id: number) => {
    const user = await this.getUser(id);

    if (user.lastFMUser == null) {
      throw new AppError.LastFm('You have no lastfm username');
    }

    return user.lastFMUser.username;
  };

  private readonly findUser = async (id: number) => {
    return await this.repo.findOne({
      where: { id },
      relations: { lastFMUser: true, friends: true }
    });
  };

  setUser = async ({
    id,
    lastfmUsername
  }: {
    id: number;
    lastfmUsername: string;
  }) => {
    const user = await this.getUser(id);

    const lastFmUser = await lastFMService.getUser(lastfmUsername);

    user.lastFMUser = lastFmUser;
    await this.repo.save(user);
    return user;
  };

  createUser = async (id: number, username?: string) => {
    const userCount = await this.repo.count();
    const user = new User();
    user.id = id;
    user.username = username ?? '';
    user.role = userCount === 0 ? 'admin' : 'user';
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
    const user = await this.getUser(id);

    const friend = await lastFMService.getUser(friendName);

    user.friends.push(friend);

    await this.repo.save(user);

    return friend;
  };

  getUserFriends = async (id: number) => {
    const user = await this.getUser(id);

    return user.friends;
  };
}

export const userService = new UserService();
