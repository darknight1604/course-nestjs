import { UserRole } from '@task-management/constants';
import { PaginationDto } from '@task-management/core/dtos/pagination.dto';

export class SearchUserDto extends PaginationDto {
  username?: string;
  isActive?: boolean;
  role?: UserRole;
}
