import { type Repository } from 'typeorm';
import { LastFMuser } from '../entity/lastFMUser';
import { dataSource } from '../connections/data-source';
import { type LastFmUserDTO } from '../api/getUserInfo/types';
import { lastFMApiService } from './lastFMApiService';

class LastFMService {
  repo: Repository<LastFMuser>;

  constructor () {
    this.repo = dataSource.getRepository(LastFMuser);
  }

  findUser = async (username: string) => {
    return await this.repo.findOne({ where: { username } });
  };

  getUser = async (username: string) => {
    const fromDBUser = await this.findUser(username);

    if (fromDBUser != null) return fromDBUser;

    const user = await lastFMApiService.getUserInfo(username);

    const newUser = await this.createUser(user);

    return newUser;
  };

  createUser = async (userDTO: LastFmUserDTO) => {
    const user = new LastFMuser();
    user.username = userDTO.name;
    user.url = userDTO.url;
    user.image = userDTO.image[3]['#text'];
    return await this.repo.save(user);
  };
}

export const lastFMService = new LastFMService();
