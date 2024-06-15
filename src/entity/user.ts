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

  @Column({
    type: 'text',
    default: 'user',
    nullable: false,
    enum: ['admin', 'user']
  })
    role: string;

  @OneToOne(() => LastFMuser, (lastFMuser) => lastFMuser)
  @JoinColumn()
    lastFMUser?: LastFMuser;

  @ManyToMany(() => LastFMuser, (lastFMUser) => lastFMUser.users, {
    cascade: true
  })
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
