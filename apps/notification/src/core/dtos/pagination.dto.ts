// pagination.dto.ts
import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  orderBy?: string; // e.g. "createdDate"

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value ? String(value).toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'])
  orderDir?: 'ASC' | 'DESC'; // e.g. "DESC"
}
