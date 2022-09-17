import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'users',
})
export class User {

  @PrimaryGeneratedColumn('increment', {
    type: 'bigint'
  })
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    length: 32,
  })
  @Exclude()
  salt: string;

  @CreateDateColumn()
  timeCreated: Date;

  @UpdateDateColumn()
  timeUpdated: Date;

  constructor(username: string, password: string, salt: string) {
    this.username = username;
    this.password = password;
    this.salt = salt;
  }

}