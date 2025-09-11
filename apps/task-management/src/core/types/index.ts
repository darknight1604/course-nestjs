import { FindOptionsWhere } from 'typeorm';

export interface PaginationOptions<T> {
  page?: number; // page number (1-based)
  limit?: number; // items per page
  where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>; // TypeORM where conditions
  order?: { [P in keyof T]?: 'ASC' | 'DESC' };
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
