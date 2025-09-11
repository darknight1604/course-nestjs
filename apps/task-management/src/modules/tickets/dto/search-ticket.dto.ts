import { PaginationDto } from '@task-management/core/dtos/pagination.dto';

export class SearchTicketDto extends PaginationDto {
  title?: string;

  status?: string;

  assigneeId?: number;

  createdById?: number;

  teamId?: number;

  sprintId?: number;
}
