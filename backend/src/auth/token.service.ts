import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import * as crypto from 'crypto';
import ms from 'ms';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateTokens(userId: string, role: string) {
    const accessTokenPayload = { sub: userId, role };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET')!,
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') as any,
    });

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(refreshToken);

    const expiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    const expiresAt = new Date(Date.now() + ms(expiresIn as ms.StringValue));

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAndRotateRefreshToken(token: string) {
    const tokenHash = this.hashToken(token);

    const refreshTokenRecord = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !refreshTokenRecord ||
      refreshTokenRecord.revokedAt ||
      refreshTokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Revoke the old token
    await this.prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // Generate new pair
    return this.generateTokens(
      refreshTokenRecord.userId,
      refreshTokenRecord.user.role,
    );
  }

  async revokeRefreshToken(token: string) {
    const tokenHash = this.hashToken(token);

    const refreshTokenRecord = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (refreshTokenRecord && !refreshTokenRecord.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  async generateExchangeCode(userId: string): Promise<string> {
    const code = crypto.randomBytes(32).toString('hex');
    const codeHash = this.hashToken(code);
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    await this.prisma.oAuthExchangeCode.create({
      data: {
        userId,
        codeHash,
        expiresAt,
      },
    });

    return code;
  }

  async exchangeCode(code: string) {
    const codeHash = this.hashToken(code);

    const exchangeRecord = await this.prisma.oAuthExchangeCode.findUnique({
      where: { codeHash },
      include: { user: true },
    });

    if (
      !exchangeRecord ||
      exchangeRecord.usedAt ||
      exchangeRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired exchange code');
    }

    // Mark as used
    await this.prisma.oAuthExchangeCode.update({
      where: { id: exchangeRecord.id },
      data: { usedAt: new Date() },
    });

    const tokens = await this.generateTokens(
      exchangeRecord.userId,
      exchangeRecord.user.role,
    );

    return {
      user: {
        id: exchangeRecord.user.id,
        email: exchangeRecord.user.email,
        fullName: exchangeRecord.user.fullName,
        role: exchangeRecord.user.role,
      },
      ...tokens,
    };
  }
}
