import { PaginationDto } from '@task-management/core/dtos/pagination.dto';

export class SearchCommentDto extends PaginationDto {
  createdById?: number;
  ticketId?: number;
}
