import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '@/common/entities/abstract.entity';

export type MaterialType = 'raw_material' | 'semi_finished' | 'finished';

@Entity({ name: 'material_categories' })
export class MaterialCategory extends AbstractEntity {

  @ApiProperty({ description: 'Unique material category code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Material category name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Detailed name of material category', required: false })
  @Column({ type: 'text', nullable: true })
  detailName?: string;

  @ApiProperty({ description: 'Material category description', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Material specifications', required: false })
  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @ApiProperty({ description: 'Safety stock number', default: 0 })
  @Column({ type: 'int', default: 0 })
  safetyStockNumber: number;

  @ApiProperty({ description: 'Unit of measurement', default: 'pcs' })
  @Column({ type: 'varchar', default: 'pcs' })
  unit: string;

  @ApiProperty({ 
    description: 'Material type',
    enum: ['raw_material', 'semi_finished', 'finished'],
    default: 'raw_material'
  })
  @Column({ type: 'varchar', default: 'raw_material' })
  type: MaterialType;

  @ApiProperty({ description: 'Is material category active', default: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
