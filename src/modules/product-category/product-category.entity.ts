import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '@/common/entities/abstract.entity';

export type ProductCategoryType = 'electronics' | 'clothing' | 'food' | 'furniture' | 'books' | 'sports' | 'beauty' | 'automotive' | 'home' | 'other';

@Entity({ name: 'product_categories' })
export class ProductCategory extends AbstractEntity {

  @ApiProperty({ description: 'Product category name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Product category description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ 
    description: 'Product category type',
    enum: ['electronics', 'clothing', 'food', 'furniture', 'books', 'sports', 'beauty', 'automotive', 'home', 'other'],
    default: 'other'
  })
  @Column({ type: 'varchar', default: 'other' })
  type: ProductCategoryType;
}
