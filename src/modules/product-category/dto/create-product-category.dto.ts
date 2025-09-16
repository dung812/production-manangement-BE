import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductCategoryDto {
  @ApiPropertyOptional({ description: 'User who created the product category' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ description: 'User who last modified the product category' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiProperty({ description: 'Product category name', example: 'Điện tử' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiPropertyOptional({ description: 'Product category description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product category type',
    enum: ['electronics', 'clothing', 'food', 'furniture', 'books', 'sports', 'beauty', 'automotive', 'home', 'other'],
    default: 'other'
  })
  @IsOptional()
  @IsIn(['electronics', 'clothing', 'food', 'furniture', 'books', 'sports', 'beauty', 'automotive', 'home', 'other'])
  type?: 'electronics' | 'clothing' | 'food' | 'furniture' | 'books' | 'sports' | 'beauty' | 'automotive' | 'home' | 'other';
}
