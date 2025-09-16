import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBomDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'ID sản phẩm gốc' })
  @IsOptional()
  @IsInt()
  rootId?: number;

  @ApiPropertyOptional({ description: 'Trường sắp xếp', default: 'createdDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdDate';

  @ApiPropertyOptional({ description: 'Chiều sắp xếp', default: 'desc' })
  @IsOptional()
  @IsString()
  sortDir?: string = 'desc';
}

export class BomTreeQueryDto {
  @ApiPropertyOptional({ description: 'ID sản phẩm gốc' })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  rootId?: number;
}


