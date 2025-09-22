import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@task-management/modules/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse } from './types/login-response';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '@task-management/modules/sessions/sessions.service';
import { getStringValue } from '@task-management/core/utils/string-utils';
import dayjs from '@task-management/core/config/dayjs.config';
import { LoginAccessTokenPayload } from './types/login-token-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionsService: SessionsService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findOne('username', loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    if (!user.isActive) {
      throw new ForbiddenException('User account is inactive');
    }
    const isMatch = await bcrypt.compare(loginDto.password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload: LoginAccessTokenPayload = {
      sub: user.id + '',
      username: user.username,
      roles: user.roles,
    };
    const accessToken = await this.getAccessToken(payload);
    const refreshToken = await this.getRefreshToken(payload);

    const now = dayjs().utc();
    await this.sessionsService.create({
      userId: user.id,
      refreshToken,
      accessToken,
      revoked: false,
      ipAddress: loginDto.ipAddress,
      userAgent: loginDto.userAgent,
      createdDate: now,
      updatedDate: now,
      expiredAt: now.add(
        parseInt(this.getAccessTokenExpireDuration(), 10),
        'seconds',
      ),
    });

    // On login → save session in both DB and Redis.
    // TODO: Save session in Redis
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: user.username,
      roles: user.roles,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.sessionsService.revokeAll(userId);
  }

  async refreshToken(oldRefreshToken: string): Promise<LoginResponse> {
    try {
      await this.jwtService.verifyAsync<LoginAccessTokenPayload>(
        oldRefreshToken,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Access token expired');
      }
      throw new BadRequestException('Invalid token');
    }

    const session = await this.sessionsService.findOne(
      'refreshToken',
      oldRefreshToken,
    );
    if (!session) {
      throw new BadRequestException('Invalid refresh token');
    }
    if (session.revoked) {
      throw new BadRequestException('Refresh token has been revoked');
    }

    const user = await this.userService.findOne('id', session.userId);
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }
    const newPayload: LoginAccessTokenPayload = {
      sub: user.id + '',
      username: user.username,
      roles: user.roles,
    };
    const accessToken = await this.getAccessToken(newPayload);
    const refreshToken = await this.getRefreshToken(newPayload);

    const now = dayjs().utc();
    await this.sessionsService.create({
      userId: user.id,
      refreshToken,
      accessToken,
      revoked: false,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdDate: now,
      updatedDate: now,
      expiredAt: now.add(
        parseInt(this.getAccessTokenExpireDuration(), 10),
        'seconds',
      ),
    });
    await this.sessionsService.revokeSession(session.id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: user.username,
      roles: user.roles,
    };
  }

  private getAccessTokenExpireDuration() {
    return getStringValue(
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    );
  }

  private async getAccessToken(payload: LoginAccessTokenPayload) {
    const accessTokenExpireDuration = this.getAccessTokenExpireDuration();
    const accessTokenExpireUnit = getStringValue(
      this.configService.get<string>('JWT_ACCESS_TOKEN_UNIT'),
    );

    return await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpireDuration + accessTokenExpireUnit || '5m',
    });
  }

  private async getRefreshToken(payload: LoginAccessTokenPayload) {
    const refreshTokenExpireDuration = getStringValue(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    );
    const refreshTokenExpireUnit = getStringValue(
      this.configService.get<string>('JWT_REFRESH_TOKEN_UNIT'),
    );
    return await this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpireDuration + refreshTokenExpireUnit || '7d',
    });
  }
}
