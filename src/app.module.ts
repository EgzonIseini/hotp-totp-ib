import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Authentication } from './auth/model/entity/authentication.entity';
import { TwoFactorAuthentication } from './auth/model/entity/two-factor-authentication.entity';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ibotp',
      database: 'ibotp',
      password: 'ibotp',
      synchronize: true,
      entities: [
        User,
        Authentication,
        TwoFactorAuthentication,
      ],
      autoLoadEntities: true,
    }),
    AuthModule,
    UsersModule,
    SecurityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
