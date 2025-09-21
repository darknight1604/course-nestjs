import { Between } from 'typeorm';
import { PaginationDto } from '../dtos/pagination.dto';
import { isNonEmptyString } from './string-utils';

export function buildOrderOptions({ orderBy, orderDir }: PaginationDto) {
  return isNonEmptyString(orderBy) ? { [orderBy!]: orderDir } : {};
}

export function buildDateRange(
  startDate?: Date,
  endDate?: Date,
  columnName: string = 'createdDate',
): Record<string, any> {
  if (startDate && endDate) {
    return { [columnName]: Between(startDate, endDate) };
  } else if (startDate) {
    return { [columnName]: Between(startDate, new Date()) };
  } else if (endDate) {
    return { [columnName]: Between(new Date(0), endDate) }; // from epoch start
  }
  return {};
}
