import { Module } from '@nestjs/common';
import { OtpController } from './controller/otp.controller';
import { OTPService } from './service/otp.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [
    OtpController
  ],
  providers: [
    OTPService
  ],
  imports: [
    UsersModule,
    AuthModule
  ]
})
export class SecurityModule {}
