import {
  PaginationOptions,
  PaginationResult,
} from '@task-management/core/types';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne<K extends keyof T>(key: K, value: T[K]): Promise<T | null> {
    return this.repository.findOneBy({ [key]: value } as T);
  }

  async update(id: number, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findOne('id' as keyof T, id as T[keyof T]);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async paginate(options: PaginationOptions<T>): Promise<PaginationResult<T>> {
    const { page = 1, limit = 10, where, order } = options;

    const [data, total] = await this.repository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
    } as FindManyOptions<T>);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
