import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryProductDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by product name or code' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by product type',
    enum: ['finished', 'semi_finished', 'raw_material'],
  })
  @IsOptional()
  @IsIn(['finished', 'semi_finished', 'raw_material'])
  productType?: 'finished' | 'semi_finished' | 'raw_material';

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
