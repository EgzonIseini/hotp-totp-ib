import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OTPService } from '../service/otp.service';
import { UserService } from '../../users/user.service';
import { TwoFaService } from '../../auth/service/two-fa.service';
import { VerifyOtpRequest } from '../model/request/verify-otp.request';

@Controller('/otp')
export class OtpController {

  constructor(private readonly otpService: OTPService,
              private readonly userService: UserService,
              private readonly twoFaService: TwoFaService) {
  }

  @Post('/verify')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpRequest): Promise<boolean> {
    const userTwoFa = await this.twoFaService.getTwoFactorByUserId(verifyOtpDto.userId);
    return this.otpService.verifyOtp(verifyOtpDto.otp, userTwoFa);
  }

  @Get('/hotp/:username')
  async getHOTP(@Param('username') username: string): Promise<string[]> {
    const user = await this.userService.findUserByUsername(username);
    const userTwoFa = await this.twoFaService.getTwoFactorByUserId(user.id);
    const hotp = this.otpService.computeHotp(userTwoFa.secret, userTwoFa.counter);
    await this.twoFaService.incrementCounter(user.id);

    return hotp;
  }

  @Get('/totp/:username')
  async getTOTP(@Param('username') username: string): Promise<string[]> {
    const user = await this.userService.findUserByUsername(username);
    const userTwoFa = await this.twoFaService.getTwoFactorByUserId(user.id);

    return this.otpService.computeTotp(
      userTwoFa.secret,
    );
  }

}