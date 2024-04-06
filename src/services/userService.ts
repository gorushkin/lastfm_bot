import { getUserInfo } from '@/api/getUserInfo/getUserInfo';
import { dataSource } from '@/connetctions/data-source';
import { User } from '@/entity/user';
import { AppError } from '@/errors';
import { type Repository } from 'typeorm';

class UserService {
  repo: Repository<User>;

  constructor () {
    this.repo = dataSource.getRepository(User);
  }

  isUserExist = async (id: number) => await this.repo.findOneBy({ id });

  getLastFmUser = async (lastFMUser: string) => {
    const response = await getUserInfo(lastFMUser);
    if (response.ok) {
      return response.data.user;
    }
    return null;
  };

  checkLastFmUsername = async (lastFMUser: string) => {
    return !((await this.getLastFmUser(lastFMUser)) == null);
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
    const lastFmUser = await this.getLastFmUser(lastFMUser);

    if (lastFmUser === null) {
      throw new AppError.LastFmError();
    }
    user.lastFMUser = lastFMUser;
    user.image = lastFmUser.image[3]['#text'];
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
