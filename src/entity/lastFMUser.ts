import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';

@Entity()
@Unique(['id', 'name'])
export class LastFMuser {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @OneToMany(() => LastFMuser, (lastFMuser) => lastFMuser.friends)
    friends: LastFMuser[];
}
