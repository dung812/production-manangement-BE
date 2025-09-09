import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductListResponseDto, ProductResponseDto, FilterConfigDto } from './dto/product-response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(queryDto: QueryProductDto): Promise<ProductListResponseDto> {
    const { page = 0, size = 20, search, productType, isActive, sortBy = 'createdDate', sortDir = 'desc' } = queryDto;
    
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.code) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (productType) {
      queryBuilder.andWhere('product.productType = :productType', { productType });
    }

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('product.isActive = :isActive', { isActive });
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
    queryBuilder.orderBy(`product.${sortField}`, sortDirection);

    // Apply pagination
    const skip = page * size;
    queryBuilder.skip(skip).take(size);

    // Get results and count
    const [data, total] = await queryBuilder.getManyAndCount();
    
    const totalPages = Math.ceil(total / size);

    // Transform data to match expected response format
    const results: ProductResponseDto[] = data.map(product => ({
      createdDate: product.createdAt.toISOString(),
      lastModifiedDate: product.updatedAt.toISOString(),
      createdBy: product.createdBy || '',
      modifiedBy: product.updatedBy || '',
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      productType: product.productType,
      specifications: product.specifications || '',
      standardTime: product.standardTime,
      unit: product.unit,
      isActive: product.isActive,
    }));

    // Create filter configuration
    const filterConfig: FilterConfigDto = {
      supportedFields: [
        {
          fieldName: 'name',
          displayName: 'Product Name',
          operator: 'LIKE',
          type: 'STRING',
          alternativeOperators: ['EQ', 'LIKE'],
          suggestionValues: [],
        },
        {
          fieldName: 'code',
          displayName: 'Product Code',
          operator: 'LIKE',
          type: 'STRING',
          alternativeOperators: ['EQ', 'LIKE'],
          suggestionValues: [],
        },
        {
          fieldName: 'productType',
          displayName: 'Product Type',
          operator: 'EQ',
          type: 'STRING',
          alternativeOperators: ['EQ'],
          suggestionValues: [
            { identifyValue: 'finished', displayValue: 'Finished Product' },
            { identifyValue: 'semi_finished', displayValue: 'Semi-Finished Product' },
            { identifyValue: 'raw_material', displayValue: 'Raw Material' },
          ],
        },
        {
          fieldName: 'isActive',
          displayName: 'Active Status',
          operator: 'EQ',
          type: 'BOOLEAN',
          alternativeOperators: ['EQ'],
          suggestionValues: [
            { identifyValue: 'true', displayValue: 'Active' },
            { identifyValue: 'false', displayValue: 'Inactive' },
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

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Check if product code already exists
    const existingProduct = await this.productRepository.findOne({
      where: { code: createProductDto.code },
    });

    if (existingProduct) {
      throw new ConflictException(`Product with code '${createProductDto.code}' already exists`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      productType: createProductDto.productType ?? 'finished',
      unit: createProductDto.unit ?? 'pcs',
      isActive: createProductDto.isActive ?? true,
    });

    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Check if updating code and if new code already exists
    if (updateProductDto.code && updateProductDto.code !== product.code) {
      const existingProduct = await this.productRepository.findOne({
        where: { code: updateProductDto.code },
      });

      if (existingProduct) {
        throw new ConflictException(`Product with code '${updateProductDto.code}' already exists`);
      }
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
