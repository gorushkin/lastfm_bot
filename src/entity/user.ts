import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

@Entity()
@Unique(['id'])
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    username: string;

  @Column({ nullable: true })
    lastFMUser: string;

  @Column()
    image?: string;
}
