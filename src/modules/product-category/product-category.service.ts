import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { ProductCategoryListResponseDto, ProductCategoryResponseDto, FilterConfigDto } from './dto/product-category-response.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async findAll(queryDto: QueryProductCategoryDto): Promise<ProductCategoryListResponseDto> {
    const { page = 0, size = 20, search, type, sortBy = 'createdDate', sortDir = 'desc' } = queryDto;
    
    const queryBuilder = this.productCategoryRepository.createQueryBuilder('productCategory');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        'LOWER(productCategory.name) LIKE LOWER(:search)',
        { search: `%${search}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere('productCategory.type = :type', { type });
    }

    // Apply sorting
    const sortFieldMap: { [key: string]: string } = {
      'createdDate': 'createdAt',
      'lastModifiedDate': 'updatedAt',
      'name': 'name'
    };
    const sortField = sortFieldMap[sortBy] || 'createdAt';
    const sortDirection = sortDir?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    queryBuilder.orderBy(`productCategory.${sortField}`, sortDirection);

    // Apply pagination
    const skip = page * size;
    queryBuilder.skip(skip).take(size);

    // Get results and count
    const [data, total] = await queryBuilder.getManyAndCount();
    
    const totalPages = Math.ceil(total / size);

    // Transform data to match expected response format
    const results: ProductCategoryResponseDto[] = data.map(productCategory => ({
      createdDate: productCategory.createdAt.toISOString(),
      lastModifiedDate: productCategory.updatedAt.toISOString(),
      createdBy: productCategory.createdBy || '',
      modifiedBy: productCategory.updatedBy || '',
      id: productCategory.id,
      name: productCategory.name,
      description: productCategory.description || '',
      type: productCategory.type,
    }));

    // Create filter configuration
    const filterConfig: FilterConfigDto = {
      supportedFields: [
        {
          fieldName: 'name',
          displayName: 'Tên loại sản phẩm',
          operator: 'LIKE',
          type: 'STRING',
          alternativeOperators: ['EQ', 'LIKE'],
          suggestionValues: [],
        },
        {
          fieldName: 'type',
          displayName: 'Loại danh mục',
          operator: 'EQ',
          type: 'STRING',
          alternativeOperators: ['EQ'],
          suggestionValues: [
            { identifyValue: 'electronics', displayValue: 'Điện tử' },
            { identifyValue: 'clothing', displayValue: 'Thời trang' },
            { identifyValue: 'food', displayValue: 'Thực phẩm' },
            { identifyValue: 'furniture', displayValue: 'Nội thất' },
            { identifyValue: 'books', displayValue: 'Sách' },
            { identifyValue: 'sports', displayValue: 'Thể thao' },
            { identifyValue: 'beauty', displayValue: 'Làm đẹp' },
            { identifyValue: 'automotive', displayValue: 'Ô tô' },
            { identifyValue: 'home', displayValue: 'Gia dụng' },
            { identifyValue: 'other', displayValue: 'Khác' },
          ],
        },
      ],
      supportedSorts: ['createdDate', 'lastModifiedDate', 'name'],
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

  async findOne(id: number): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOne({ where: { id } });
    if (!productCategory) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }
    return productCategory;
  }

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = this.productCategoryRepository.create({
      ...createProductCategoryDto,
      type: createProductCategoryDto.type ?? 'other',
    });

    return this.productCategoryRepository.save(productCategory);
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto): Promise<ProductCategory> {
    const productCategory = await this.findOne(id);

    Object.assign(productCategory, updateProductCategoryDto);
    return this.productCategoryRepository.save(productCategory);
  }

  async remove(id: number): Promise<void> {
    const productCategory = await this.findOne(id);
    await this.productCategoryRepository.remove(productCategory);
  }
}
