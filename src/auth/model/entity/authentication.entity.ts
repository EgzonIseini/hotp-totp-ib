import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'authentications'
})
export class Authentication {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  username: string;

  @CreateDateColumn()
  lastAuthenticated: Date;

  constructor(username: string) {
    this.username = username;
  }

}