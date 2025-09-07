import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseService } from '@task-management/core/base.service';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SessionsService extends BaseService<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {
    super(sessionRepo);
  }

  async revokeAll(userId: number): Promise<void> {
    return await this.sessionRepo
      .createQueryBuilder()
      .update(Session)
      .set({ revoked: true })
      .where('userId = :userId', { userId })
      .andWhere('revoked = :revoked', { revoked: false })
      .execute()
      .then(() => undefined);
  }

  async validateSession(
    userId: number,
    ipAddress: string,
    userAgent: string,
  ): Promise<boolean> {
    // TODO: Search session at Redis first
    const sessions = await this.sessionRepo.find({
      where: {
        userId: userId,
        ipAddress: ipAddress,
        userAgent: userAgent,
        revoked: false,
      },
    });

    if (sessions.length === 0) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
