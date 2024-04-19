import { type Repository } from 'typeorm';
import { LastFMuser } from '@/entity/lastFMUser';
import { dataSource } from '@/connetctions/data-source';
import { getUserInfo } from '@/api/getUserInfo/getUserInfo';
import { type LastFmUserDTO } from '@/api/getUserInfo/types';
import { AppError } from '@/errors';

class LastFMService {
  repo: Repository<LastFMuser>;

  constructor () {
    this.repo = dataSource.getRepository(LastFMuser);
  }

  findUser = async (username: string) => {
    return await this.repo.findOne({ where: { name: username } });
  };

  getUser = async (username: string) => {
    const user = await this.findUser(username);
    if (user != null) return user;

    const response = await getUserInfo(username);

    if (!response.ok) {
      console.log(response.error);
      // throw new AppError.ServiceError();
    }

    return null;
  };

  createUser = async (userDTO: LastFmUserDTO) => {
    const user = new LastFMuser();
    user.name = userDTO.name;
    user.url = userDTO.url;
    user.image = userDTO.image[3]['#text'];
    await this.repo.save(user);
    return userDTO;
  };
}

export const lastFMService = new LastFMService();
