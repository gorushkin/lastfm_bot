import { getUserInfo } from '@/api/getUserInfo/getUserInfo';
import { dataSource } from '@/connections/data-source';
import { User } from '@/entity/user';
import { AppError } from '@/errors';
import { type Repository } from 'typeorm';
import { lastFMService } from './lstFmUserService';
import { getRecentTracks } from '@/api/getRecentTracks/getRecentTracks';

class UserService {
  repo: Repository<User>;

  constructor () {
    this.repo = dataSource.getRepository(User);
  }

  findUser = async (id: number) => {
    return await this.repo.findOne({
      where: { id },
      relations: { lastFMUser: true }
    });
  };

  checkLastFmUsername = async (lastFMUser: string) => {
    return !((await lastFMService.getUser(lastFMUser)) == null);
  };

  setLastFMUser = async ({
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
    const tracks = await this.getUserTracks(id);

    return tracks
      .slice(0, 10)
      .map((item) => `<a href="${item.url}">${item.artist}: ${item.name}</a>`)
      .join('\n');
  };

  getUserTracks = async (id: number) => {
    const user = await this.findUser(id);
    if (user === null) {
      throw new AppError.User();
    }
    const response = await getRecentTracks(user.lastFMUser.username);

    const tracks = response.recenttracks.track.map((item) => {
      return {
        artist: item.artist['#text'],
        name: item.name,
        album: item.album['#text'],
        url: item.url
      };
    });

    return tracks;
  };
}

export const userService = new UserService();
