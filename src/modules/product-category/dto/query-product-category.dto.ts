import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryProductCategoryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by name' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by product category type',
    enum: ['electronics', 'clothing', 'food', 'furniture', 'books', 'sports', 'beauty', 'automotive', 'home', 'other']
  })
  @IsOptional()
  @IsIn(['electronics', 'clothing', 'food', 'furniture', 'books', 'sports', 'beauty', 'automotive', 'home', 'other'])
  type?: 'electronics' | 'clothing' | 'food' | 'furniture' | 'books' | 'sports' | 'beauty' | 'automotive' | 'home' | 'other';

  @ApiPropertyOptional({ 
    description: 'Sort field',
    enum: ['createdDate', 'lastModifiedDate', 'name'],
    default: 'createdDate'
  })
  @IsOptional()
  @IsIn(['createdDate', 'lastModifiedDate', 'name'])
  sortBy?: 'createdDate' | 'lastModifiedDate' | 'name';

  @ApiPropertyOptional({ 
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
