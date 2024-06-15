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

  @OneToMany(() => User, (user) => user.lastFMUser)
    users: User[];

  @Column()
    image: string;

  @Column()
    url: string;

  @ManyToMany(() => User, (user) => user.friends)
    friends: User[];
}
