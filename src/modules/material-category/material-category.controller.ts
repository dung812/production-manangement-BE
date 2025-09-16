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
import { MaterialCategoryService } from './material-category.service';
import { CreateMaterialCategoryDto } from './dto/create-material-category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material-category.dto';
import { QueryMaterialCategoryDto } from './dto/query-material-category.dto';
import { MaterialCategory } from './material-category.entity';
import { MaterialCategoryListResponseDto } from './dto/material-category-response.dto';

@ApiTags('Material Categories')
@Controller('api/v1/material-categories')
export class MaterialCategoryController {
  constructor(private readonly materialCategoryService: MaterialCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all material categories with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Material categories retrieved successfully',
    type: MaterialCategoryListResponseDto,
  })
  async findAll(@Query() queryDto: QueryMaterialCategoryDto): Promise<MaterialCategoryListResponseDto> {
    return this.materialCategoryService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a material category by ID' })
  @ApiParam({ name: 'id', description: 'Material Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Material category retrieved successfully',
    type: MaterialCategory,
  })
  @ApiResponse({ status: 404, description: 'Material category not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialCategoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new material category' })
  @ApiResponse({
    status: 201,
    description: 'Material category created successfully',
    type: MaterialCategory,
  })
  @ApiResponse({ status: 409, description: 'Material category code already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a material category' })
  @ApiParam({ name: 'id', description: 'Material Category ID' })
  @ApiResponse({
    status: 200,
    description: 'Material category updated successfully',
    type: MaterialCategory,
  })
  @ApiResponse({ status: 404, description: 'Material category not found' })
  @ApiResponse({ status: 409, description: 'Material category code already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterialCategoryDto: UpdateMaterialCategoryDto,
  ) {
    return this.materialCategoryService.update(id, updateMaterialCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a material category' })
  @ApiParam({ name: 'id', description: 'Material Category ID' })
  @ApiResponse({ status: 204, description: 'Material category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Material category not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialCategoryService.remove(id);
  }
}
