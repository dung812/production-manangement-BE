import { ApiProperty } from '@nestjs/swagger';

export class BomResponseDto {
  @ApiProperty() createdDate: string;
  @ApiProperty() lastModifiedDate: string;
  @ApiProperty() createdBy: string;
  @ApiProperty() modifiedBy: string;
  @ApiProperty() id: number;
  @ApiProperty() productId: number;
  @ApiProperty() productPartPath: string;
  @ApiProperty() quantityOfProd: number;
  @ApiProperty() materialId: string;
  @ApiProperty() quantityOfMaterials: number;
  @ApiProperty() tileHH: string;
  @ApiProperty() applicationDate: string;
  @ApiProperty() endDate: string;
  @ApiProperty() tkVatTu: string;
  @ApiProperty() tkh: string;
}

export class SuggestionValueDto { identifyValue: string; displayValue: string; }

export class SupportedFieldDto {
  fieldName: string;
  displayName: string;
  operator: 'EQ';
  type: 'DATE' | 'STRING' | 'NUMBER';
  alternativeOperators: ('EQ')[];
  suggestionValues: SuggestionValueDto[];
}

export class FilterConfigDto {
  supportedFields: SupportedFieldDto[];
  supportedSorts: string[];
}

export class BomListResponseDto {
  results: BomResponseDto[];
  pageSize: number;
  sortBy: string;
  isLastItem: boolean;
  totalPage: number;
  totalElement: number;
  filterConfig: FilterConfigDto;
}

export class BomTreeNodeDto {
  id: number;
  productId: number;
  productPartPath: string;
  quantityOfProd: number;
  materialId: string;
  quantityOfMaterials: number;
  children: BomTreeNodeDto[];
}


