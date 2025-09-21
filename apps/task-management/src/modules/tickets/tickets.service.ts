import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@task-management/core/base.service';
import { PaginationResult } from '@task-management/core/types';
import {
  buildDateRange,
  buildOrderOptions,
} from '@task-management/core/utils/pagination-utils';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { SearchTicketDto } from './dto/search-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService extends BaseService<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {
    super(ticketRepo);
  }

  async search(query: SearchTicketDto): Promise<PaginationResult<Ticket>> {
    const {
      title,
      status,
      assigneeId,
      createdById,
      teamId,
      sprintId,
      orderBy = 'updatedDate',
      orderDir = 'DESC',
      startDate,
      endDate,
      ...paginationOptions
    } = query;
    const orderOptions = buildOrderOptions({ orderBy, orderDir });
    const whereCondition:
      | FindOptionsWhere<Ticket>
      | FindOptionsWhere<Ticket>[] = {
      ...(title && { title: Like(`%${title}%`) }),
      ...(status && { status }),
      ...(assigneeId && { assigneeId }),
      ...(createdById && { createdById }),
      ...(teamId && { teamId }),
      ...(sprintId && { sprintId }),
      ...buildDateRange(startDate, endDate),
    };

    return await this.paginate({
      ...paginationOptions,
      order: orderOptions,
      where: whereCondition,
    });
  }
}
