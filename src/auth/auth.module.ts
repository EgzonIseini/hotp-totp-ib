import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./service/local.strategy";
import { AuthController } from "./controller/auth.controller";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from './model/entity/authentication.entity';
import { TwoFactorAuthentication } from './model/entity/two-factor-authentication.entity';
import { TwoFaService } from './service/two-fa.service';

@Module({
  providers: [
    AuthService,
    TwoFaService,
    LocalStrategy
  ],
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([
      Authentication,
      TwoFactorAuthentication
    ])
  ],
  controllers: [
    AuthController
  ],
  exports: [
    TwoFaService
  ]
})
export class AuthModule {}
