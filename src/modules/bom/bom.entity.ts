import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Entity({ name: 'boms' })
export class Bom extends AbstractEntity {

  @ApiProperty({ description: 'ID sản phẩm gốc chứa BOM' })
  @Index()
  @Column({ type: 'int' })
  rootProductId: number;

  @ApiProperty({ description: 'ID sản phẩm con (nếu BOM đại diện cho chi tiết là sản phẩm)', required: false })
  @Column({ type: 'int', nullable: true })
  productId?: number;

  @ApiProperty({ description: 'Đường dẫn phân cấp của bộ phận sản phẩm (ví dụ: 1/3/7)' })
  @Index()
  @Column({ type: 'varchar' })
  productPartPath: string;

  @ApiProperty({ description: 'Số lượng sản phẩm (đơn vị thành phẩm)', default: 0 })
  @Column({ type: 'int', default: 0 })
  quantityOfProd: number;

  @ApiProperty({ description: 'Mã vật tư/định danh vật liệu' })
  @Column({ type: 'varchar' })
  materialId: string;

  @ApiProperty({ description: 'Số lượng vật tư', default: 0 })
  @Column({ type: 'int', default: 0 })
  quantityOfMaterials: number;

  @ApiProperty({ description: 'Tỉ lệ hao hụt', required: false })
  @Column({ type: 'varchar', nullable: true })
  tileHH?: string;

  @ApiProperty({ description: 'Ngày áp dụng', required: false })
  @Column({ type: 'date', nullable: true })
  applicationDate?: string | Date;

  @ApiProperty({ description: 'Ngày kết thúc', required: false })
  @Column({ type: 'date', nullable: true })
  endDate?: string | Date;

  @ApiProperty({ description: 'Tài khoản vật tư', required: false })
  @Column({ type: 'varchar', nullable: true })
  tkVatTu?: string;

  @ApiProperty({ description: 'TKH', required: false })
  @Column({ type: 'varchar', nullable: true })
  tkh?: string;

  @ApiProperty({ description: 'ID BOM cha', required: false })
  @Index()
  @Column({ type: 'int', nullable: true })
  parentId?: number;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}


