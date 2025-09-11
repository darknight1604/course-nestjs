import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@task-management/core/base.service';
import { PaginationResult } from '@task-management/core/types';
import { buildOrderOptions } from '@task-management/core/utils/pagination-utils';
import { Repository } from 'typeorm';
import { SearchCommentDto } from './dto/search-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {
    super(commentRepo);
  }

  async search(query: SearchCommentDto): Promise<PaginationResult<Comment>> {
    const { createdById, ticketId, orderBy, orderDir, ...rest } = query;
    const orderOptions = buildOrderOptions({ orderBy, orderDir });

    return await this.paginate({
      ...rest,
      order: orderOptions,
      where: {
        ...(ticketId && { ticketId }),
        ...(createdById && { createdById }),
      },
    });
  }
}
