import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginAccessTokenPayload } from '../types/login-token-payload';
import { Request } from 'express';
import { SessionsService } from '@task-management/modules/sessions/sessions.service';
import { STRING_KEYS } from '@task-management/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload =
        await this.jwtService.verifyAsync<LoginAccessTokenPayload>(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

      const userId = parseInt(payload.sub, 10);
      await this.sessionService.validateSession(
        userId,
        request.ip || '',
        request.headers[STRING_KEYS.USER_AGENT] as string,
      );

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
