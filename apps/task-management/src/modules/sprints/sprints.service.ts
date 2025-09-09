import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@task-management/core/base.service';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintsService extends BaseService<Sprint> {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
  ) {
    super(sprintRepo);
  }
}
