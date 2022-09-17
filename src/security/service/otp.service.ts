import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { decode } from 'hi-base32';
import { TwoFactorAuthentication } from '../../auth/model/entity/two-factor-authentication.entity';
import { OtpType } from '../../auth/model/enum/otp-type.enum';
import { TwoFaService } from '../../auth/service/two-fa.service';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';

@Injectable()
export class OTPService {

  constructor(private readonly twoFaService: TwoFaService) {
  }

  computeTotp(secret: string, window = 1): string[] {
    const otps: string[] = [];
    for (let i = -window; i <= window; i++) {
      const futureDate = (Date.now() / 1000) + (i * 30);
      const futureCounter = futureDate / 30;
      otps.push(this.computeOtp(secret, futureCounter));
    }
    return otps;
  }

  computeHotp(secret: string, counter: number, window = 100): string[] {
    const otps: string[] = [];
    for (let i = 0; i < window; i++) {
      otps.push(this.computeOtp(secret, counter + i));
    }
    return otps;
  }

  private computeOtp(secret: string, counter: number): string {
    const counterBuffer = this.numberToBuffer(counter);
    const hash = createHmac('SHA1', decode(secret))
      .update(counterBuffer)
      .digest();
    const offset = hash[19] & 0xf;
    const code = (hash[offset] & 0x7f) << 24
      | (hash[offset + 1] & 0xff) << 16
      | (hash[offset + 2] & 0xff) << 8
      | (hash[offset + 3] & 0xff);

    const codeString = code.toString();
    return codeString.substring(codeString.length - 6);
  }

  private numberToBuffer = (input: number, length = 8) => {
    const buffer = Buffer.alloc(length);

    for (let i = buffer.length - 1; i >= 0; i -= 1) {
      buffer[i] = input & 0xff;
      input >>= 8;
    }

    return buffer;
  };

  async verifyOtp(otp: string, userTwoFa: TwoFactorAuthentication): Promise<boolean> {
    const otps = userTwoFa.otpType === OtpType.TOTP ? this.computeTotp(userTwoFa.secret) : this.computeHotp(userTwoFa.secret, userTwoFa.counter);
    const isOtpValid = otps.find(it => it === otp);

    if (!isOtpValid) {
      throw new RuntimeException('OTP was not valid!');
    }

    if (userTwoFa.otpType === OtpType.HOTP) {
      await this.twoFaService.incrementCounter(userTwoFa.userId);
    }

    return true;
  }

}