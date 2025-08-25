import { Injectable } from '@nestjs/common';
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
}
