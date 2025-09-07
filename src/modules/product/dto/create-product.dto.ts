import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiPropertyOptional({ description: 'User who created the product' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'User who last modified the product' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({ description: 'Unique product code', example: 'PROD-001' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  code: string;

  @ApiProperty({ description: 'Product name', example: 'Sample Product' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Category ID', default: 0 })
  @IsOptional()
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Product type',
    enum: ['finished', 'semi_finished', 'raw_material'],
    default: 'finished'
  })
  @IsOptional()
  @IsIn(['finished', 'semi_finished', 'raw_material'])
  productType?: 'finished' | 'semi_finished' | 'raw_material';

  @ApiPropertyOptional({ description: 'Product specifications' })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({ description: 'Standard time in minutes', default: 0 })
  @IsOptional()
  @IsInt()
  standardTime?: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', default: 'pcs' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Is product active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
