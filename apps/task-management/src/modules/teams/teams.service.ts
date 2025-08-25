import { Injectable } from '@nestjs/common';
import { Team } from './entities/team.entity';
import { BaseService } from '@task-management/core/base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TeamsService extends BaseService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {
    super(teamRepo);
  }
}
