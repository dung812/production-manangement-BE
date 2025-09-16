import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryMaterialCategoryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by material category name or code' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by material type',
    enum: ['raw_material', 'semi_finished', 'finished'],
  })
  @IsOptional()
  @IsIn(['raw_material', 'semi_finished', 'finished'])
  type?: 'raw_material' | 'semi_finished' | 'finished';

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort by field',
    default: 'createdDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdDate';

  @ApiPropertyOptional({
    description: 'Sort direction',
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortDir?: string = 'desc';
}
