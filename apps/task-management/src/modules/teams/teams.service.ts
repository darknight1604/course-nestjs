import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@task-management/core/base.service';
import { PaginationResult } from '@task-management/core/types';
import { buildOrderOptions } from '@task-management/core/utils/pagination-utils';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { SearchTeamDto } from './dto/search-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService extends BaseService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {
    super(teamRepo);
  }

  async search(query: SearchTeamDto): Promise<PaginationResult<Team>> {
    const {
      name,
      orderBy = 'updatedDate',
      orderDir = 'DESC',
      ...paginationOptions
    } = query;
    const orderOptions = buildOrderOptions({ orderBy, orderDir });
    const whereCondition: FindOptionsWhere<Team> | FindOptionsWhere<Team>[] = {
      ...(name && { name: Like(`%${name}%`) }),
    };

    return await this.paginate({
      ...paginationOptions,
      order: orderOptions,
      where: whereCondition,
    });
  }
}
