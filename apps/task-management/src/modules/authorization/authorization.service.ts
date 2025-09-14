import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorizationService {
  constructor() {}

  canViewAndUpdate(userId: string, targetId: string) {
    return userId === targetId;
  }
}
