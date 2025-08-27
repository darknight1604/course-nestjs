import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { LoginResponse } from './types/login-response';
import { CanHealthCheck } from '@task-management/core/can-health-check';
import { AuthGuard } from './auth.guard';
import { getStringValue } from '@task-management/core/utils/string-utils';
import { IncomingHttpHeaders } from 'http';

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
    console.log('login is called');
    console.log('ipAddress: ', ipAddress);
    console.log('req: ', req, '- userAgent: ', req.headers['user-agent']);

    const loginDto: LoginDto = {
      ...body,
      ipAddress: getStringValue(ipAddress),
      userAgent: getStringValue(req.headers['user-agent']),
    };
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: any }): Record<string, any> {
    return (req.user || {}) as Record<string, any>;
  }
}
