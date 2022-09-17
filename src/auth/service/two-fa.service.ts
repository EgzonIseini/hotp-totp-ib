import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TwoFactorAuthentication } from '../model/entity/two-factor-authentication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TwoFaService {

  constructor(@InjectRepository(TwoFactorAuthentication) private readonly twoFactorAuthentications: Repository<TwoFactorAuthentication>) {
  }

  getTwoFactorByUserId(userId: number): Promise<TwoFactorAuthentication> {
    return this.twoFactorAuthentications.findOne({
      where: {
        userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async incrementCounter(id: number): Promise<TwoFactorAuthentication> {
    const twoFaAuthentication = await this.getTwoFactorByUserId(id);
    twoFaAuthentication.counter += 1;
    return this.twoFactorAuthentications.save(twoFaAuthentication);
  }

}