import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param, ParseBoolPipe, ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from '../local-auth.guard';
import { RegisterUserRequest } from '../model/request/reigster-user.request.interface';
import { User } from '../../users/user.entity';
import { AuthService } from '../service/auth.service';
import { User2FactorAuthenticationResponse } from '../model/response/user-2fa.response.interface';

@Controller('/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  authenticateUser(@Request() req) {
    return req.user;
  }

  @Post('/register')
  registerUser(@Body() registerUserRequest: RegisterUserRequest): Promise<User> {
    return this.authService.registerUser(registerUserRequest.username, registerUserRequest.password);
  }

  @Get('/2fa/:userId')
  async getTwoFactorAuthForUserId(@Param('userId', ParseIntPipe) userId: number): Promise<User2FactorAuthenticationResponse> {
    const user2FA = await this.authService.getTwoFactorAuthForUserId(userId);

    return <User2FactorAuthenticationResponse>{
      userId: user2FA?.userId,
      otpEnabled: user2FA?.otpEnabled,
      otpType: user2FA?.otpType.toString(),
      secret: user2FA?.secret
    };
  }

  @Patch('/2fa/:userId')
  async toggleUserTwoFactorAuthentication(@Param('userId', ParseIntPipe) userId: number,
                                          @Query('enabled', ParseBoolPipe) twoFaEnabled: boolean,
                                          @Query('otpType') otpType: string): Promise<User2FactorAuthenticationResponse> {
    const user2FA = await this.authService.toggleUserTwoFactorAuthentication(userId, otpType, twoFaEnabled);

    return <User2FactorAuthenticationResponse>{
      userId: user2FA.userId,
      otpEnabled: user2FA.otpEnabled,
      otpType: user2FA.otpType.toString(),
      secret: user2FA.secret
    };
  }

}