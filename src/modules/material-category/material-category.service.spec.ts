import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialCategoryService } from './material-category.service';
import { MaterialCategory } from './material-category.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MaterialCategoryService', () => {
  let service: MaterialCategoryService;
  let repository: Repository<MaterialCategory>;

  const mockMaterialCategory = {
    id: 1,
    code: 'VT-TEST-001',
    name: 'Test Material',
    detailName: 'Test Material Detail',
    description: 'Test Description',
    specifications: 'Test Specs',
    safetyStockNumber: 10,
    unit: 'pcs',
    type: 'raw_material',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialCategoryService,
        {
          provide: getRepositoryToken(MaterialCategory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaterialCategoryService>(MaterialCategoryService);
    repository = module.get<Repository<MaterialCategory>>(getRepositoryToken(MaterialCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a material category if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockMaterialCategory);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMaterialCategory);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if material category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      code: 'VT-TEST-001',
      name: 'Test Material',
      type: 'raw_material' as const,
    };

    it('should create a material category successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null); // No existing material category
      mockRepository.create.mockReturnValue(mockMaterialCategory);
      mockRepository.save.mockResolvedValue(mockMaterialCategory);

      const result = await service.create(createDto);

      expect(result).toEqual(mockMaterialCategory);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { code: createDto.code } });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if code already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockMaterialCategory);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });
});
