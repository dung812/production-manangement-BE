import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  createdDate: string;

  @ApiProperty()
  lastModifiedDate: string;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  modifiedBy?: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ 
    enum: ['finished', 'semi_finished', 'raw_material'],
    default: 'finished'
  })
  productType: string;

  @ApiProperty({ required: false })
  specifications?: string;

  @ApiProperty()
  standardTime: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  isActive: boolean;
}

export class SuggestionValueDto {
  @ApiProperty()
  identifyValue: string;

  @ApiProperty()
  displayValue: string;
}

export class SupportedFieldDto {
  @ApiProperty()
  fieldName: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ enum: ['EQ', 'NE', 'GT', 'GTE', 'LT', 'LTE', 'LIKE', 'IN'] })
  operator: string;

  @ApiProperty({ enum: ['STRING', 'NUMBER', 'DATE', 'BOOLEAN'] })
  type: string;

  @ApiProperty({ type: [String] })
  alternativeOperators: string[];

  @ApiProperty({ type: [SuggestionValueDto] })
  suggestionValues: SuggestionValueDto[];
}

export class FilterConfigDto {
  @ApiProperty({ type: [SupportedFieldDto] })
  supportedFields: SupportedFieldDto[];

  @ApiProperty({ type: [String] })
  supportedSorts: string[];
}

export class ProductListResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  results: ProductResponseDto[];

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  sortBy: string;

  @ApiProperty()
  isLastItem: boolean;

  @ApiProperty()
  totalPage: number;

  @ApiProperty()
  totalElement: number;

  @ApiProperty()
  filterConfig: FilterConfigDto;
}
