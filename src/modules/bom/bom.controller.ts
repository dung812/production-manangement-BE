import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BomService } from './bom.service';
import { CreateBomDto } from './dto/create-bom.dto';
import { UpdateBomDto } from './dto/update-bom.dto';
import { QueryBomDto } from './dto/query-bom.dto';
import { BomListResponseDto, BomResponseDto, BomTreeNodeDto } from './dto/bom-response.dto';

@ApiTags('BOM')
@Controller('bom')
export class BomController {
  constructor(private readonly bomService: BomService) {}

  @Get('tree')
  @ApiOperation({ summary: 'Get complete BOM hierarchical tree structure' })
  @ApiResponse({ status: 200, type: [BomTreeNodeDto] })
  tree(): Promise<BomTreeNodeDto[]> {
    return this.bomService.buildAllTrees();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BOM entry by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: BomResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BomResponseDto> {
    return this.bomService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get BOM entries by root product ID with pagination and sorting' })
  @ApiResponse({ status: 200, type: BomListResponseDto })
  findAll(@Query() query: QueryBomDto): Promise<BomListResponseDto> {
    return this.bomService.findAll(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update BOM entry with hierarchy recalculation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: BomResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBomDto,
  ): Promise<BomResponseDto> {
    return this.bomService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete BOM entry' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.bomService.remove(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create BOM entry with automatic hierarchy path generation' })
  @ApiResponse({ status: 201, type: BomResponseDto })
  create(@Body() dto: CreateBomDto): Promise<BomResponseDto> {
    return this.bomService.create(dto);
  }

  
}


