import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMaterialCategoryDto {
  @ApiPropertyOptional({ description: 'User who created the material category' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'User who last modified the material category' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({ description: 'Unique material category code', example: 'MAT-001' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  code: string;

  @ApiProperty({ description: 'Material category name', example: 'Thép xây dựng' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Detailed name of material category', example: 'Thép xây dựng loại A' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  detailName?: string;

  @ApiPropertyOptional({ description: 'Material category description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Material specifications' })
  @IsOptional()
  @IsString()
  specifications?: string;

  @ApiPropertyOptional({ description: 'Safety stock number', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  safetyStockNumber?: number;

  @ApiPropertyOptional({ description: 'Unit of measurement', default: 'pcs' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  unit?: string;

  @ApiPropertyOptional({
    description: 'Material type',
    enum: ['raw_material', 'semi_finished', 'finished'],
    default: 'raw_material'
  })
  @IsOptional()
  @IsIn(['raw_material', 'semi_finished', 'finished'])
  type?: 'raw_material' | 'semi_finished' | 'finished';

  @ApiPropertyOptional({ description: 'Is material category active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
