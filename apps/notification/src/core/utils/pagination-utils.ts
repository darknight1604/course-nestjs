import { PaginationDto } from '../dtos/pagination.dto';
import { isNonEmptyString } from './string-utils';

export function buildOrderOptions({ orderBy, orderDir }: PaginationDto) {
  return isNonEmptyString(orderBy) ? { [orderBy!]: orderDir } : {};
}
