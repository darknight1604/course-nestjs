import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from './decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { LoginAccessTokenPayload } from './types/login-token-payload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as LoginAccessTokenPayload;

    return this.matchRoles(roles, user.roles);
  }

  matchRoles(allowedRoles: string[], userRoles: string[]): boolean {
    return allowedRoles.some((role) => userRoles.includes(role));
  }
}
