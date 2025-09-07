import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      const productId = 1;
      const expectedProduct = { id: productId, name: 'Test Product' } as Product;

      mockRepository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.findOne(productId);

      expect(result).toEqual(expectedProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 1;

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
    });
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        code: 'PROD-001',
        name: 'Test Product',
      };

      const createdProduct = { id: 1, ...createProductDto } as Product;

      mockRepository.findOne.mockResolvedValue(null); // No existing product
      mockRepository.create.mockReturnValue(createdProduct);
      mockRepository.save.mockResolvedValue(createdProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { code: createProductDto.code } });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(createdProduct);
    });

    it('should throw ConflictException when product code already exists', async () => {
      const createProductDto: CreateProductDto = {
        code: 'PROD-001',
        name: 'Test Product',
      };

      const existingProduct = { id: 1, code: 'PROD-001' } as Product;

      mockRepository.findOne.mockResolvedValue(existingProduct);

      await expect(service.create(createProductDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { code: createProductDto.code } });
    });
  });
});
