import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';

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
}
