import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBomDto {
  @ApiProperty({ description: 'ID sản phẩm gốc (root)' })
  @IsInt()
  rootProductId: number;

  @ApiPropertyOptional({ description: 'ID sản phẩm con' })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiPropertyOptional({ description: 'ID BOM cha để tạo đường dẫn tự động' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: 'Số lượng sản phẩm' })
  @IsInt()
  @Min(0)
  quantityOfProd: number;

  @ApiProperty({ description: 'Mã vật tư' })
  @IsString()
  @IsNotEmpty()
  materialId: string;

  @ApiProperty({ description: 'Số lượng vật tư' })
  @IsInt()
  @Min(0)
  quantityOfMaterials: number;

  @ApiPropertyOptional({ description: 'Tỉ lệ hao hụt' })
  @IsOptional()
  @IsString()
  tileHH?: string;

  @ApiPropertyOptional({ description: 'Ngày áp dụng' })
  @IsOptional()
  @IsDateString()
  applicationDate?: string;

  @ApiPropertyOptional({ description: 'Ngày kết thúc' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'TK vật tư' })
  @IsOptional()
  @IsString()
  tkVatTu?: string;

  @ApiPropertyOptional({ description: 'TKH' })
  @IsOptional()
  @IsString()
  tkh?: string;
}


