import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '@/common/entities/abstract.entity';

export type ProductType = 'finished' | 'semi_finished' | 'raw_material';

@Entity({ name: 'products' })
export class Product extends AbstractEntity {

  @ApiProperty({ description: 'Unique product code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Product name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Product description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Category ID', default: 0 })
  @Column({ type: 'int', default: 0 })
  categoryId: number;

  @ApiProperty({ 
    description: 'Product type',
    enum: ['finished', 'semi_finished', 'raw_material'],
    default: 'finished'
  })
  @Column({ type: 'varchar', default: 'finished' })
  productType: ProductType;

  @ApiProperty({ description: 'Product specifications', required: false })
  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @ApiProperty({ description: 'Standard time in minutes', default: 0 })
  @Column({ type: 'int', default: 0 })
  standardTime: number;

  @ApiProperty({ description: 'Unit of measurement', default: 'pcs' })
  @Column({ type: 'varchar', default: 'pcs' })
  unit: string;

  @ApiProperty({ description: 'Is product active', default: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
