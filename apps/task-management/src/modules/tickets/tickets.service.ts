import { Injectable } from '@nestjs/common';
import { BaseService } from '@task-management/core/base.service';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationResult } from '@task-management/core/types';
import { SearchTicketDto } from './dto/search-ticket.dto';
import { isNonEmptyString } from '@task-management/core/utils/string-utils';

@Injectable()
export class TicketsService extends BaseService<Ticket> {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {
    super(ticketRepo);
  }

  async search(
    searchTicketDto: SearchTicketDto,
  ): Promise<PaginationResult<Ticket>> {
    const {
      title,
      status,
      assigneeId,
      createdById,
      teamId,
      sprintId,
      orderBy,
      orderDir,
      ...paginationOptions
    } = searchTicketDto;
    return await this.paginate({
      ...paginationOptions,
      order: isNonEmptyString(orderBy) ? { [orderBy!]: orderDir } : {},
      where: {
        ...(title && { title }),
        ...(status && { status }),
        ...(assigneeId && { assigneeId }),
        ...(createdById && { createdById }),
        ...(teamId && { teamId }),
        ...(sprintId && { sprintId }),
      },
    });
  }
}
