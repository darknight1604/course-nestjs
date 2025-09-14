import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Request,
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
import { LoginResponse } from './types/login-response';
import { LoginAccessTokenPayload } from './types/login-token-payload';

@Controller('auth')
export class AuthController implements CanHealthCheck {
  constructor(private readonly authService: AuthService) {}

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
  ): Promise<LoginResponse> {
    const loginDto: LoginDto = {
      ...body,
      ipAddress: getStringValue(ipAddress),
      userAgent: getStringValue(req.headers[STRING_KEYS.USER_AGENT]),
    };
    return await this.authService.login(loginDto);
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
  logout(@Request() req: { user: LoginAccessTokenPayload }): Promise<void> {
    return this.authService.logout(parseInt(req.user.sub, 10));
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  @Get('admin-check')
  adminHealthCheck(): string {
    return 'Admin role is working!';
  }
}
