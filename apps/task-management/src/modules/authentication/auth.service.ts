import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@task-management/modules/users/users.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse } from './types/login-response';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '@task-management/modules/sessions/sessions.service';
import { getStringValue } from '@task-management/core/utils/string-utils';

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

    const isMatch = await bcrypt.compare(loginDto.password, user?.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const payload = { sub: user.id, username: user.username };
    const accessTokenExpireDuration = getStringValue(
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    );
    const accessTokenExpireUnit = getStringValue(
      this.configService.get<string>('JWT_ACCESS_TOKEN_UNIT'),
    );
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpireDuration + accessTokenExpireUnit || '5m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION') || '7d',
    });

    const now = new Date();
    await this.sessionsService.create({
      userId: user.id,
      refreshToken,
      accessToken,
      revoked: false,
      ipAddress: loginDto.ipAddress,
      userAgent: loginDto.userAgent,
      createdDate: now,
      updatedDate: now,
      expiredAt: now.setMinutes(
        now.getMinutes() + parseInt(accessTokenExpireDuration, 10),
      ),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
