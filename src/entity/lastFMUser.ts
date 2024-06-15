import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['id', 'username'])
export class LastFMuser {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    username: string;

  @OneToMany(() => LastFMuser, (lastFMuser) => lastFMuser.friends)
    friends: LastFMuser[];

  @Column()
    image: string;

  @Column()
    url: string;

  @ManyToMany(() => User, (user) => user.friends)
    users: User[];
}
