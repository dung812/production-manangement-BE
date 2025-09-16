import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from './product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;
  let repository: Repository<ProductCategory>;

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    })),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductCategoryService>(ProductCategoryService);
    repository = module.get<Repository<ProductCategory>>(getRepositoryToken(ProductCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const queryDto: QueryProductCategoryDto = { page: 0, size: 10 };
      const result = await service.findAll(queryDto);
      
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('pageSize');
      expect(result).toHaveProperty('totalElement');
      expect(result).toHaveProperty('filterConfig');
    });
  });

  describe('findOne', () => {
    it('should return a product category', async () => {
      const mockProductCategory = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
        type: 'electronics',
      };
      
      mockRepository.findOne.mockResolvedValue(mockProductCategory);
      
      const result = await service.findOne(1);
      expect(result).toEqual(mockProductCategory);
    });

    it('should throw NotFoundException when product category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new product category', async () => {
      const createDto: CreateProductCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
        type: 'electronics',
      };

      const mockProductCategory = { id: 1, ...createDto };
      
      mockRepository.create.mockReturnValue(mockProductCategory);
      mockRepository.save.mockResolvedValue(mockProductCategory);
      
      const result = await service.create(createDto);
      expect(result).toEqual(mockProductCategory);
    });
  });

  describe('update', () => {
    it('should update a product category', async () => {
      const mockProductCategory = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
        type: 'electronics',
      };
      
      const updateDto: UpdateProductCategoryDto = {
        name: 'Updated Category',
      };

      mockRepository.findOne.mockResolvedValue(mockProductCategory);
      mockRepository.save.mockResolvedValue({ ...mockProductCategory, ...updateDto });
      
      const result = await service.update(1, updateDto);
      expect(result.name).toBe('Updated Category');
    });
  });

  describe('remove', () => {
    it('should remove a product category', async () => {
      const mockProductCategory = {
        id: 1,
        name: 'Test Category',
        description: 'Test Description',
        type: 'electronics',
      };
      
      mockRepository.findOne.mockResolvedValue(mockProductCategory);
      mockRepository.remove.mockResolvedValue(mockProductCategory);
      
      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProductCategory);
    });
  });
});
