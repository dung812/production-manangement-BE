import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProductCategoryService } from './product-category.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { ProductCategory } from './product-category.entity';
import { ProductCategoryListResponseDto } from './dto/product-category-response.dto';

@ApiTags('Product Categories')
@Controller('api/v1/product-categories')
export class ProductCategoryController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product categories with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Product categories retrieved successfully',
    type: ProductCategoryListResponseDto,
  })
  async findAll(@Query() queryDto: QueryProductCategoryDto): Promise<ProductCategoryListResponseDto> {
    return this.productCategoryService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by ID' })
  @ApiParam({ name: 'id', description: 'Product Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Product category retrieved successfully',
    type: ProductCategory,
  })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({
    status: 201,
    description: 'Product category created successfully',
    type: ProductCategory,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({ name: 'id', description: 'Product Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Product category updated successfully',
    type: ProductCategory,
  })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', description: 'Product Category ID' })
  @ApiResponse({ status: 204, description: 'Product category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product category not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoryService.remove(id);
  }
}
