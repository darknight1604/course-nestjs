import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { LoginResponse } from './types/login-response';
import { CanHealthCheck } from '@task-management/core/can-health-check';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController implements CanHealthCheck {
  constructor(private readonly authService: AuthService) {}

  @Get()
  healthCheck(): string {
    return 'Auth module is working!';
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: any }): Record<string, any> {
    return (req.user || {}) as Record<string, any>;
  }
}
