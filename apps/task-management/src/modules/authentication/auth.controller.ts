import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { STRING_KEYS, UserRole } from '@task-management/constants';
import { CanHealthCheck } from '@task-management/core/can-health-check';
import { getStringValue } from '@task-management/core/utils/string-utils';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LoginAccessTokenPayload } from './types/login-token-payload';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './types/login-response';

@Controller('auth')
export class AuthController implements CanHealthCheck {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'Auth module is working!';
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Ip() ipAddress: string,
    @Request() req: { headers: IncomingHttpHeaders },
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<LoginResponse, 'refreshToken'>> {
    const loginDto: LoginDto = {
      ...body,
      ipAddress: getStringValue(ipAddress),
      userAgent: getStringValue(req.headers[STRING_KEYS.USER_AGENT]),
    };
    const { refreshToken, ...rest } = await this.authService.login(loginDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge:
        1000 *
        (this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION') ||
          604800), // 7 days
    });

    return rest;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: { user: LoginAccessTokenPayload },
  ): Record<string, any> {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @Request() req: { user: LoginAccessTokenPayload },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie('access_token');
    return this.authService.logout(parseInt(req.user.sub, 10));
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @Get('admin-check')
  adminHealthCheck(): string {
    return 'Admin role is working!';
  }
}
