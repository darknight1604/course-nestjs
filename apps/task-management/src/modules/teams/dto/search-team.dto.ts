import { PaginationDto } from '@task-management/core/dtos/pagination.dto';

export class SearchTeamDto extends PaginationDto {
  name?: string;
}
