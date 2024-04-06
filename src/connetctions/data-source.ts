import { DataSource } from 'typeorm';
import { config } from '@/config'
import { User } from '@/entity/user';

export const dataSource: DataSource = new DataSource({
  type: 'sqlite',
  database: config.DATABASE,
  entities: [User],
  synchronize: true,
  subscribers: [],
  migrations: []
});
