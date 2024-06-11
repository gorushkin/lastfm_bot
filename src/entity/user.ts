import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

import { LastFMuser } from './lastFMUser';

@Entity()
@Unique(['id'])
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    username: string;

  @OneToOne(() => LastFMuser, (lastFMuser) => lastFMuser)
  @JoinColumn()
    lastFMUser?: LastFMuser;
}
