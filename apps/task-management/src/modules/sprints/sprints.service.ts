import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@task-management/core/base.service';
import { PaginationResult } from '@task-management/core/types';
import { buildOrderOptions } from '@task-management/core/utils/pagination-utils';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { SearchSprintDto } from './dto/search-sprint.dto';
import { Sprint } from './entities/sprint.entity';

@Injectable()
export class SprintsService extends BaseService<Sprint> {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepo: Repository<Sprint>,
  ) {
    super(sprintRepo);
  }

  async search(query: SearchSprintDto): Promise<PaginationResult<Sprint>> {
    const {
      title,
      teamId,
      orderBy = 'updatedDate',
      orderDir = 'DESC',
      ...paginationOptions
    } = query;
    const orderOptions = buildOrderOptions({ orderBy, orderDir });
    const whereCondition:
      | FindOptionsWhere<Sprint>
      | FindOptionsWhere<Sprint>[] = {
      ...(title && { title: ILike(`%${title}%`) }),
      ...(teamId && { teamId: teamId }),
    };

    return await this.paginate({
      ...paginationOptions,
      order: orderOptions,
      where: whereCondition,
    });
  }
}
