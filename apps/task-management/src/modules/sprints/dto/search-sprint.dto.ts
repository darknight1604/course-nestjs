import { PaginationDto } from '@task-management/core/dtos/pagination.dto';

export class SearchSprintDto extends PaginationDto {
  title?: string;
  teamId?: number;
}
