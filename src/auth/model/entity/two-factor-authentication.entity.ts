import {
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/user.entity';
import { OtpType } from '../enum/otp-type.enum';
import { ColumnNumberTransformer } from '../../../column-number.transformer';

@Entity({
  name: 'two_fa_authentications'
})
export class TwoFactorAuthentication {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('bigint', {
    transformer: new ColumnNumberTransformer()
  })
  @Index()
  userId: number;

  @Column()
  otpType: OtpType;

  @Column()
  otpEnabled: boolean;

  @Column()
  secret: string;

  @Column('bigint', {
    transformer: new ColumnNumberTransformer()
  })
  counter: number;

  @UpdateDateColumn()
  timeUpdated: Date;

  constructor(userId: number, otpType: OtpType, otpEnabled: boolean, secret: string, counter: number) {
    this.userId = userId;
    this.otpType = otpType;
    this.otpEnabled = otpEnabled;
    this.secret = secret;
    this.counter = counter;
  }

}