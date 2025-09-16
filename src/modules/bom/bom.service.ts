import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bom } from './bom.entity';
import { CreateBomDto } from './dto/create-bom.dto';
import { UpdateBomDto } from './dto/update-bom.dto';
import { QueryBomDto } from './dto/query-bom.dto';
import { BomListResponseDto, BomResponseDto, BomTreeNodeDto, FilterConfigDto } from './dto/bom-response.dto';

@Injectable()
export class BomService {
  constructor(
    @InjectRepository(Bom) private readonly bomRepository: Repository<Bom>,
  ) {}

  private mapEntityToResponse(entity: Bom): BomResponseDto {
    return {
      createdDate: entity.createdAt?.toISOString(),
      lastModifiedDate: entity.updatedAt?.toISOString(),
      createdBy: entity.createdBy ?? 'system',
      modifiedBy: entity.updatedBy ?? 'system',
      id: entity.id,
      productId: entity.productId ?? 0,
      productPartPath: entity.productPartPath,
      quantityOfProd: entity.quantityOfProd,
      materialId: entity.materialId,
      quantityOfMaterials: entity.quantityOfMaterials,
      tileHH: entity.tileHH ?? '',
      applicationDate: entity.applicationDate ? new Date(entity.applicationDate).toISOString().substring(0,10) : '',
      endDate: entity.endDate ? new Date(entity.endDate).toISOString().substring(0,10) : '',
      tkVatTu: entity.tkVatTu ?? '',
      tkh: entity.tkh ?? '',
    };
  }

  async findOne(id: number): Promise<BomResponseDto> {
    const entity = await this.bomRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`BOM with ID ${id} not found`);
    return this.mapEntityToResponse(entity);
  }

  private async generatePath(rootProductId: number, parentId?: number): Promise<string> {
    if (!parentId) {
      // First level under root
      const siblings = await this.bomRepository.count({ where: { rootProductId, parentId: null as any } });
      return `${rootProductId}/${siblings + 1}`;
    }
    const parent = await this.bomRepository.findOne({ where: { id: parentId } });
    if (!parent) throw new NotFoundException('Parent BOM not found');
    const siblings = await this.bomRepository.count({ where: { rootProductId, parentId } });
    return `${parent.productPartPath}/${siblings + 1}`;
  }

  async create(dto: CreateBomDto): Promise<BomResponseDto> {
    const productPartPath = await this.generatePath(dto.rootProductId, dto.parentId);
    const entity = this.bomRepository.create({
      ...dto,
      productPartPath,
      createdBy: 'admin',
      updatedBy: 'admin',
    });
    const saved = await this.bomRepository.save(entity);
    return this.mapEntityToResponse(saved);
  }

  async update(id: number, dto: UpdateBomDto): Promise<BomResponseDto> {
    const entity = await this.bomRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`BOM with ID ${id} not found`);

    Object.assign(entity, dto);

    // If parentId or rootProductId changed, recalc path of this node and descendants
    if (dto.parentId !== undefined || dto.rootProductId !== undefined) {
      const newPath = await this.generatePath(dto.rootProductId ?? entity.rootProductId, dto.parentId ?? entity.parentId);
      const oldPath = entity.productPartPath;
      entity.productPartPath = newPath;
      await this.bomRepository.save(entity);
      // Update descendants
      const descendants = await this.bomRepository
        .createQueryBuilder('b')
        .where('b.productPartPath LIKE :p', { p: `${oldPath}/%` })
        .getMany();
      for (const d of descendants) {
        d.productPartPath = d.productPartPath.replace(oldPath + '/', newPath + '/');
      }
      if (descendants.length) await this.bomRepository.save(descendants);
      return this.mapEntityToResponse(entity);
    }

    const saved = await this.bomRepository.save(entity);
    return this.mapEntityToResponse(saved);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.bomRepository.findOne({ where: { id } });
    if (!entity) return;
    await this.bomRepository.softRemove(entity);
  }

  async findAll(query: QueryBomDto): Promise<BomListResponseDto> {
    const { page = 0, size = 20, rootId, sortBy = 'createdDate', sortDir = 'desc' } = query;

    const qb = this.bomRepository.createQueryBuilder('bom');
    if (rootId) qb.andWhere('bom.rootProductId = :rootId', { rootId });

    const sortFieldMap: { [k: string]: string } = {
      createdDate: 'createdAt',
      lastModifiedDate: 'updatedAt',
      productId: 'productId',
    };
    const sortField = sortFieldMap[sortBy] || 'createdAt';
    const direction = sortDir?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy(`bom.${sortField}`, direction);

    qb.skip(page * size).take(size);
    const [data, total] = await qb.getManyAndCount();

    const results = data.map((it) => this.mapEntityToResponse(it));
    const totalPages = Math.ceil(total / size);

    const filterConfig: FilterConfigDto = {
      supportedFields: [
        {
          fieldName: 'rootId',
          displayName: 'Sản phẩm gốc',
          operator: 'EQ',
          type: 'NUMBER',
          alternativeOperators: ['EQ'],
          suggestionValues: [],
        },
      ],
      supportedSorts: ['createdDate', 'lastModifiedDate', 'productId'],
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

  async buildTree(rootId: number): Promise<BomTreeNodeDto[]> {
    const items = await this.bomRepository.find({ where: { rootProductId: rootId } });
    const byId = new Map<number, BomTreeNodeDto>();
    const roots: BomTreeNodeDto[] = [];
    for (const it of items) {
      const node: BomTreeNodeDto = {
        id: it.id,
        productId: it.productId ?? 0,
        productPartPath: it.productPartPath,
        quantityOfProd: it.quantityOfProd,
        materialId: it.materialId,
        quantityOfMaterials: it.quantityOfMaterials,
        children: [],
      };
      byId.set(it.id, node);
    }
    for (const it of items) {
      const node = byId.get(it.id)!;
      if (it.parentId) {
        const parent = byId.get(it.parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  async buildAllTrees(): Promise<BomTreeNodeDto[]> {
    const items = await this.bomRepository.find();
    const byId = new Map<number, BomTreeNodeDto>();
    const roots: BomTreeNodeDto[] = [];

    for (const it of items) {
      const node: BomTreeNodeDto = {
        id: it.id,
        productId: it.productId ?? 0,
        productPartPath: it.productPartPath,
        quantityOfProd: it.quantityOfProd,
        materialId: it.materialId,
        quantityOfMaterials: it.quantityOfMaterials,
        children: [],
      };
      byId.set(it.id, node);
    }

    for (const it of items) {
      const node = byId.get(it.id)!;
      if (it.parentId) {
        const parent = byId.get(it.parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}


