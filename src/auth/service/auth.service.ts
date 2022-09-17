import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user.entity';
import { randomBytes, scryptSync } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Authentication } from '../model/entity/authentication.entity';
import { Repository } from 'typeorm';
import { TwoFactorAuthentication } from '../model/entity/two-factor-authentication.entity';
import { OtpType } from '../model/enum/otp-type.enum';
import { encode } from 'hi-base32';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

  constructor(protected readonly userService: UserService,
              @InjectRepository(Authentication) private readonly authenticationsRepo: Repository<Authentication>,
              @InjectRepository(TwoFactorAuthentication) private readonly twoFactorAuthentications: Repository<TwoFactorAuthentication>) {
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.userService.findUserByUsername(username);
    const hashedPassword = scryptSync(password, user.salt, 128).toString('base64');

    if (!user || user.password !== hashedPassword) return undefined;

    await this.authenticationsRepo.save(new Authentication(username));

    return user;
  }

  registerUser(username: string, password: string): Promise<User> {
    const salt = randomBytes(24).toString('base64');
    const hashedPassword = scryptSync(password, salt, 128).toString('base64');

    return this.userService.createNewUser(username.toLowerCase(), hashedPassword, salt);
  }

  async getTwoFactorAuthForUserId(userId: number): Promise<TwoFactorAuthentication | null> {
    return this.twoFactorAuthentications.findOne({
      where: {
        userId
      },
      order: {
        id: 'DESC'
      }
    })
  }

  async toggleUserTwoFactorAuthentication(userId: number, otpType: string, isTwoFaEnabled: boolean): Promise<TwoFactorAuthentication> {
    let user2Fa = await this.getTwoFactorAuthForUserId(userId)

    if (user2Fa && otpType.toUpperCase() === user2Fa.otpType.valueOf()) {
      user2Fa.otpEnabled = isTwoFaEnabled;
    } else {
      const secret = this.generateSecretKey();
      user2Fa = new TwoFactorAuthentication(userId, OtpType[otpType.toUpperCase()], isTwoFaEnabled, secret, 1);
    }

    return await this.twoFactorAuthentications.save(user2Fa);
  }

  private generateSecretKey(length: number = 8): string {
    const randomBytes = crypto.randomBytes(length)
    return encode(
      randomBytes.slice(0, length).toString()
    )
  }

}
