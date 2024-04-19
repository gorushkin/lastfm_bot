import { getUserInfo } from '@/api/getUserInfo/getUserInfo';
import { dataSource } from '@/connetctions/data-source';
import { User } from '@/entity/user';
import { AppError } from '@/errors';
import { type Repository } from 'typeorm';
import { lastFMService } from './lstFmUserService';

class UserService {
  repo: Repository<User>;

  constructor () {
    this.repo = dataSource.getRepository(User);
  }

  isUserExist = async (id: number) => await this.repo.findOneBy({ id });

  checkLastFmUsername = async (lastFMUser: string) => {
    return !((await lastFMService.getUser(lastFMUser)) == null);
  };

  setLastFMUser = async ({
    id,
    lastFMUser
  }: {
    id: number;
    lastFMUser: string;
  }) => {
    const user = await this.isUserExist(id);

    if (user === null) {
      throw new AppError.UserError();
    }

    const lastFmUser = await lastFMService.getUser(lastFMUser);

    if (lastFmUser === null) {
      throw new AppError.LastFmError();
    }

    user.lastFMUser = lastFMUser;
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
    const user = await this.isUserExist(id);
    if (user === null) {
      return await this.createUser(id, username);
    }
    return user;
  };
}

export const userService = new UserService();
