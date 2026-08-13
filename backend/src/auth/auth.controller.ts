import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ExchangeCodeDto } from './dto/exchange-code.dto';
import { TokenService } from './token.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.validateCredentials(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.tokenService.verifyAndRotateRefreshToken(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    await this.tokenService.revokeRefreshToken(dto.refreshToken);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    const userId = (req.user as any)?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect(
          `${frontendUrl}/auth/error?message=Authentication failed`,
        );
      }

      const exchangeCode = await this.tokenService.generateExchangeCode(
        user.id,
      );
      return res.redirect(`${frontendUrl}/auth/callback?code=${exchangeCode}`);
    } catch (error) {
      return res.redirect(
        `${frontendUrl}/auth/error?message=Authentication failed`,
      );
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('google/exchange')
  async exchangeGoogleCode(@Body() dto: ExchangeCodeDto) {
    return this.tokenService.exchangeCode(dto.code);
  }
}
