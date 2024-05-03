import { DataSource } from 'typeorm';
import { config } from '../config'
import { User } from '../entity/user';
import { LastFMuser } from '../entity/lastFMUser';

export const dataSource: DataSource = new DataSource({
  type: 'sqlite',
  database: config.DATABASE,
  entities: [User, LastFMuser],
  synchronize: true,
  subscribers: [],
  migrations: []
});
