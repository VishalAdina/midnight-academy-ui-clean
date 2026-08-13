import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthService, TokenService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
