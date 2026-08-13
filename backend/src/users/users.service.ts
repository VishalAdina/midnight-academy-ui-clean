import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds a user by their email address.
   * @param email The user's email address.
   * @returns The User object, or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOrCreateByGoogle(profile: any) {
    const emailObj = profile.emails?.[0];
    const emailVerified = profile._json?.email_verified === true;

    if (!emailObj || !emailVerified) {
      throw new Error('Unverified email from Google');
    }

    const email = emailObj.value;
    const providerAccountId = profile.id;
    const provider = 'google';

    const existingAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
    });

    if (existingAccount) {
      return existingAccount.user;
    }

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      await this.prisma.oAuthAccount.create({
        data: {
          userId: existingUser.id,
          provider,
          providerAccountId,
        },
      });
      return existingUser;
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        fullName: profile.displayName || null,
        role: 'STUDENT',
        oauthAccounts: {
          create: {
            provider,
            providerAccountId,
          },
        },
      },
    });

    return newUser;
  }

  /**
   * Creates a new user in the database.
   * @param data The user creation data.
   * @returns The created User object.
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
