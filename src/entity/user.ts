import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_lastfmUser',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'lastfmUserId',
      referencedColumnName: 'id'
    }
  })
    friends: LastFMuser[];

  @BeforeInsert()
  beforeInsertActions () {
    if (this.friends == null) {
      this.friends = [];
    }
  }

  @AfterLoad()
  afterLoadActions () {
    if (this.friends == null) {
      this.friends = [];
    }
  }
}
