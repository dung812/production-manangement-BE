import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialCategory } from './material-category.entity';
import { CreateMaterialCategoryDto } from './dto/create-material-category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material-category.dto';
import { QueryMaterialCategoryDto } from './dto/query-material-category.dto';
import { MaterialCategoryListResponseDto, MaterialCategoryResponseDto, FilterConfigDto } from './dto/material-category-response.dto';

@Injectable()
export class MaterialCategoryService {
  constructor(
    @InjectRepository(MaterialCategory)
    private readonly materialCategoryRepository: Repository<MaterialCategory>,
  ) {}

  async findAll(queryDto: QueryMaterialCategoryDto): Promise<MaterialCategoryListResponseDto> {
    const { page = 0, size = 20, search, type, isActive, sortBy = 'createdDate', sortDir = 'desc' } = queryDto;
    
    const queryBuilder = this.materialCategoryRepository.createQueryBuilder('materialCategory');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(materialCategory.name) LIKE LOWER(:search) OR LOWER(materialCategory.code) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere('materialCategory.type = :type', { type });
    }

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('materialCategory.isActive = :isActive', { isActive });
    }

    // Apply sorting
    const sortFieldMap: { [key: string]: string } = {
      'createdDate': 'createdAt',
      'lastModifiedDate': 'updatedAt',
      'name': 'name',
      'code': 'code'
    };
    const sortField = sortFieldMap[sortBy] || 'createdAt';
    const sortDirection = sortDir?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    queryBuilder.orderBy(`materialCategory.${sortField}`, sortDirection);

    // Apply pagination
    const skip = page * size;
    queryBuilder.skip(skip).take(size);

    // Get results and count
    const [data, total] = await queryBuilder.getManyAndCount();
    
    const totalPages = Math.ceil(total / size);

    // Transform data to match expected response format
    const results: MaterialCategoryResponseDto[] = data.map(materialCategory => ({
      createdDate: materialCategory.createdAt.toISOString(),
      lastModifiedDate: materialCategory.updatedAt.toISOString(),
      createdBy: materialCategory.createdBy || '',
      modifiedBy: materialCategory.updatedBy || '',
      id: materialCategory.id,
      code: materialCategory.code,
      name: materialCategory.name,
      detailName: materialCategory.detailName || '',
      description: materialCategory.description || '',
      specifications: materialCategory.specifications || '',
      safetyStockNumber: materialCategory.safetyStockNumber,
      unit: materialCategory.unit,
      type: materialCategory.type,
      isActive: materialCategory.isActive,
    }));

    // Create filter configuration
    const filterConfig: FilterConfigDto = {
      supportedFields: [
        {
          fieldName: 'name',
          displayName: 'Tên danh mục vật tư',
          operator: 'LIKE',
          type: 'STRING',
          alternativeOperators: ['EQ', 'LIKE'],
          suggestionValues: [],
        },
        {
          fieldName: 'code',
          displayName: 'Mã danh mục vật tư',
          operator: 'LIKE',
          type: 'STRING',
          alternativeOperators: ['EQ', 'LIKE'],
          suggestionValues: [],
        },
        {
          fieldName: 'type',
          displayName: 'Loại vật tư',
          operator: 'EQ',
          type: 'STRING',
          alternativeOperators: ['EQ'],
          suggestionValues: [
            { identifyValue: 'raw_material', displayValue: 'Nguyên liệu thô' },
            { identifyValue: 'semi_finished', displayValue: 'Bán thành phẩm' },
            { identifyValue: 'finished', displayValue: 'Thành phẩm' },
          ],
        },
        {
          fieldName: 'isActive',
          displayName: 'Trạng thái hoạt động',
          operator: 'EQ',
          type: 'BOOLEAN',
          alternativeOperators: ['EQ'],
          suggestionValues: [
            { identifyValue: 'true', displayValue: 'Đang hoạt động' },
            { identifyValue: 'false', displayValue: 'Không hoạt động' },
          ],
        },
      ],
      supportedSorts: ['createdDate', 'lastModifiedDate', 'name', 'code'],
    };

    return {
      results,
      pageSize: size,
      sortBy,
      isLastItem: page >= totalPages - 1,
      totalPage: totalPages,
      totalElement: total,
      filterConfig,
    };
  }

  async findOne(id: number): Promise<MaterialCategory> {
    const materialCategory = await this.materialCategoryRepository.findOne({ where: { id } });
    if (!materialCategory) {
      throw new NotFoundException(`Material category with ID ${id} not found`);
    }
    return materialCategory;
  }

  async create(createMaterialCategoryDto: CreateMaterialCategoryDto): Promise<MaterialCategory> {
    // Check if material category code already exists
    const existingMaterialCategory = await this.materialCategoryRepository.findOne({
      where: { code: createMaterialCategoryDto.code },
    });

    if (existingMaterialCategory) {
      throw new ConflictException(`Material category with code '${createMaterialCategoryDto.code}' already exists`);
    }

    const materialCategory = this.materialCategoryRepository.create({
      ...createMaterialCategoryDto,
      type: createMaterialCategoryDto.type ?? 'raw_material',
      unit: createMaterialCategoryDto.unit ?? 'pcs',
      safetyStockNumber: createMaterialCategoryDto.safetyStockNumber ?? 0,
      isActive: createMaterialCategoryDto.isActive ?? true,
    });

    return this.materialCategoryRepository.save(materialCategory);
  }

  async update(id: number, updateMaterialCategoryDto: UpdateMaterialCategoryDto): Promise<MaterialCategory> {
    const materialCategory = await this.findOne(id);

    // Check if updating code and if new code already exists
    if (updateMaterialCategoryDto.code && updateMaterialCategoryDto.code !== materialCategory.code) {
      const existingMaterialCategory = await this.materialCategoryRepository.findOne({
        where: { code: updateMaterialCategoryDto.code },
      });

      if (existingMaterialCategory) {
        throw new ConflictException(`Material category with code '${updateMaterialCategoryDto.code}' already exists`);
      }
    }

    Object.assign(materialCategory, updateMaterialCategoryDto);
    return this.materialCategoryRepository.save(materialCategory);
  }

  async remove(id: number): Promise<void> {
    const materialCategory = await this.findOne(id);
    await this.materialCategoryRepository.remove(materialCategory);
  }
}
