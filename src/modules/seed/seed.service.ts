import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedLog } from './seed-log.entity';
import { Product } from '../product/product.entity';
import { MaterialCategory } from '../material-category/material-category.entity';
import { ProductCategory } from '../product-category/product-category.entity';
import { Bom } from '../bom/bom.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(SeedLog) private readonly seedLogRepo: Repository<SeedLog>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(MaterialCategory) private readonly materialCategoryRepo: Repository<MaterialCategory>,
    @InjectRepository(ProductCategory) private readonly productCategoryRepo: Repository<ProductCategory>,
    @InjectRepository(Bom) private readonly bomRepo: Repository<Bom>,
  ) {}

  async onApplicationBootstrap() {
    // Toggle with env var so it doesn't run in every environment.
    if ((process.env.SEED_ON_START || '').toLowerCase() !== 'true') {
      return;
    }

    await this.seedMaterialCategories();
    await this.seedProductCategories();
    await this.seedProducts();
    await this.seedBoms();
  }

  private async seedMaterialCategories() {
    const marker = 'material-categories-initialized';
    const already = await this.seedLogRepo.findOne({ where: { name: marker } });
    if (already) {
      this.logger.log('Material categories seed skipped (already initialized).');
      return;
    }

    // Idempotent guard: also skip if data already exists.
    const count = await this.materialCategoryRepo.count();
    if (count > 0) {
      this.logger.log('Material categories seed skipped (table not empty).');
      await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
      return;
    }

    // Vietnamese material category data
    const materialCategories: Partial<MaterialCategory>[] = [
      {
        code: 'MC-THEP-TAM',
        name: 'Thép tấm',
        detailName: 'Thép tấm carbon thường',
        description: 'Thép tấm dùng trong sản xuất cơ khí',
        specifications: 'Độ dày từ 2mm đến 50mm, tiêu chuẩn TCVN',
        safetyStockNumber: 100,
        unit: 'kg',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-THEP-ONG',
        name: 'Thép ống',
        detailName: 'Thép ống tròn đen',
        description: 'Thép ống tròn dùng cho kết cấu',
        specifications: 'Đường kính từ 20mm đến 300mm',
        safetyStockNumber: 50,
        unit: 'mét',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-NHOM-TAM',
        name: 'Nhôm tấm',
        detailName: 'Tấm nhôm hợp kim 6061',
        description: 'Tấm nhôm chất lượng cao cho gia công cơ khí',
        specifications: 'Độ dày 1-20mm, kích thước 1000x2000mm',
        safetyStockNumber: 30,
        unit: 'tấm',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-DAY-DONG',
        name: 'Dây đồng',
        detailName: 'Dây đồng điện lực',
        description: 'Dây dẫn điện bằng đồng tinh khiết',
        specifications: 'Tiết diện từ 1.5mm² đến 25mm²',
        safetyStockNumber: 500,
        unit: 'mét',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-CAO-SU',
        name: 'Cao su',
        detailName: 'Cao su công nghiệp NBR',
        description: 'Cao su chịu dầu và nhiệt độ cao',
        specifications: 'Độ cứng Shore A 70±5, chịu nhiệt -40°C đến +120°C',
        safetyStockNumber: 20,
        unit: 'kg',
        type: 'auxiliary_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-INOX-304',
        name: 'Inox 304',
        detailName: 'Thép không gỉ 304',
        description: 'Thép không gỉ chất lượng cao',
        specifications: 'Thành phần: 18% Cr, 8% Ni, chịu ăn mòn tốt',
        safetyStockNumber: 80,
        unit: 'kg',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-NHUA-PVC',
        name: 'Nhựa PVC',
        detailName: 'Ống nhựa PVC áp lực',
        description: 'Ống nhựa PVC chịu áp lực cao',
        specifications: 'Áp lực làm việc PN10, PN16',
        safetyStockNumber: 200,
        unit: 'mét',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-BANH-RANG',
        name: 'Bánh răng',
        detailName: 'Bánh răng thép carbon',
        description: 'Bánh răng gia công chính xác',
        specifications: 'Modun từ 1 đến 10, số răng từ 12 đến 120',
        safetyStockNumber: 25,
        unit: 'cái',
        type: 'raw_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-VONG-BI',
        name: 'Vòng bi',
        detailName: 'Vòng bi bi cầu',
        description: 'Vòng bi chất lượng cao cho máy móc',
        specifications: 'Cấp chính xác P0, P6, chịu tải từ nhẹ đến nặng',
        safetyStockNumber: 100,
        unit: 'cái',
        type: 'auxiliary_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-DAN-THUY-LUC',
        name: 'Dầu thủy lực',
        detailName: 'Dầu thủy lực ISO VG 46',
        description: 'Dầu thủy lực chất lượng cao',
        specifications: 'Độ nhớt ISO VG 46, chỉ số độ nhớt >100',
        safetyStockNumber: 500,
        unit: 'lít',
        type: 'auxiliary_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-KEO-DAN',
        name: 'Keo dán',
        detailName: 'Keo dán epoxy 2 thành phần',
        description: 'Keo dán cường độ cao cho kim loại',
        specifications: 'Cường độ kéo >25MPa, thời gian đóng rắn 24h',
        safetyStockNumber: 50,
        unit: 'kg',
        type: 'auxiliary_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-SON-CHONG-RI',
        name: 'Sơn chống rỉ',
        detailName: 'Sơn lót chống rỉ epoxy',
        description: 'Sơn bảo vệ kim loại khỏi ăn mòn',
        specifications: 'Độ bám dính cấp 1, độ che phủ >98%',
        safetyStockNumber: 100,
        unit: 'lít',
        type: 'auxiliary_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-GIAY-NHAM',
        name: 'Giấy nhám',
        detailName: 'Giấy nhám oxide nhôm',
        description: 'Giấy nhám chất lượng cao cho đánh bóng',
        specifications: 'Độ hạt từ P80 đến P400',
        safetyStockNumber: 200,
        unit: 'tờ',
        type: 'auxiliary_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-BANG-KENG',
        name: 'Băng keo',
        detailName: 'Băng keo điện PVC',
        description: 'Băng keo cách điện chất lượng cao',
        specifications: 'Điện áp chịu đựng 600V, độ dày 0.13mm',
        safetyStockNumber: 100,
        unit: 'cuộn',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-THUNG-CARTON',
        name: 'Thùng carton',
        detailName: 'Thùng carton 5 lớp',
        description: 'Thùng đóng gói sản phẩm',
        specifications: 'Kích thước đa dạng, chịu tải 20-50kg',
        safetyStockNumber: 500,
        unit: 'cái',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-MANG-PE',
        name: 'Màng PE',
        detailName: 'Màng polyethylene bọc hàng',
        description: 'Màng bọc bảo vệ sản phẩm',
        specifications: 'Độ dày 0.05-0.2mm, trong suốt hoặc đen',
        safetyStockNumber: 50,
        unit: 'kg',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-FOAM-BAO-VE',
        name: 'Foam bảo vệ',
        detailName: 'Foam polyurethane đệm lót',
        description: 'Vật liệu đệm bảo vệ sản phẩm',
        specifications: 'Mật độ 25-35kg/m³, độ đàn hồi cao',
        safetyStockNumber: 100,
        unit: 'tấm',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-DAY-THEP',
        name: 'Dây thép',
        detailName: 'Dây thép đóng kiện',
        description: 'Dây thép dùng để đóng kiện hàng hóa',
        specifications: 'Đường kính 0.5-1.2mm, mạ kẽm',
        safetyStockNumber: 200,
        unit: 'kg',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-NHAN-TEM',
        name: 'Nhãn tem',
        detailName: 'Nhãn tem decal in thông tin',
        description: 'Nhãn dán thông tin sản phẩm',
        specifications: 'Chất liệu PVC, chống nước, kích thước đa dạng',
        safetyStockNumber: 1000,
        unit: 'cái',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'MC-BONG-XOP',
        name: 'Bọng xốp',
        detailName: 'Bọng xốp khí bảo vệ',
        description: 'Màng bọng khí chống sốc',
        specifications: 'Đường kính bọng 10mm, 20mm, độ dày 0.1mm',
        safetyStockNumber: 100,
        unit: 'mét',
        type: 'packaging_material',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    ];

    await this.materialCategoryRepo.save(this.materialCategoryRepo.create(materialCategories));
    await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
    this.logger.log('✅ Seeded initial material categories.');
  }

  private async seedProductCategories() {
    const marker = 'product-categories-initialized';
    const already = await this.seedLogRepo.findOne({ where: { name: marker } });
    if (already) {
      this.logger.log('Product categories seed skipped (already initialized).');
      return;
    }

    // Idempotent guard: also skip if data already exists.
    const count = await this.productCategoryRepo.count();
    if (count > 0) {
      this.logger.log('Product categories seed skipped (table not empty).');
      await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
      return;
    }

    // Vietnamese product category data
    const productCategories: Partial<ProductCategory>[] = [
      {
        name: 'Điện tử',
        description: 'Các sản phẩm điện tử, thiết bị công nghệ',
        type: 'electronics',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Thời trang',
        description: 'Quần áo, phụ kiện thời trang nam nữ',
        type: 'clothing',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Thực phẩm',
        description: 'Thực phẩm tươi sống, đóng gói',
        type: 'food',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Nội thất',
        description: 'Bàn ghế, tủ kệ, đồ trang trí nội thất',
        type: 'furniture',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Sách',
        description: 'Sách giáo khoa, tiểu thuyết, tạp chí',
        type: 'books',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Thể thao',
        description: 'Dụng cụ thể thao, quần áo thể thao',
        type: 'sports',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Làm đẹp',
        description: 'Mỹ phẩm, dụng cụ chăm sóc sắc đẹp',
        type: 'beauty',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Ô tô',
        description: 'Phụ tùng ô tô, dầu nhớt, phụ kiện xe hơi',
        type: 'automotive',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Gia dụng',
        description: 'Đồ gia dụng, thiết bị nhà bếp',
        type: 'home',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        name: 'Khác',
        description: 'Các sản phẩm khác không thuộc danh mục trên',
        type: 'other',
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    ];

    await this.productCategoryRepo.save(this.productCategoryRepo.create(productCategories));
    await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
    this.logger.log('✅ Seeded initial product categories.');
  }

  private async seedProducts() {
    const marker = 'products-initialized';
    const already = await this.seedLogRepo.findOne({ where: { name: marker } });
    if (already) {
      this.logger.log('Products seed skipped (already initialized).');
      return;
    }

    // Idempotent guard: also skip if data already exists.
    const count = await this.productRepo.count();
    if (count > 0) {
      this.logger.log('Products seed skipped (table not empty).');
      await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
      return;
    }

    // Initial data - comprehensive product catalog
    const items: Partial<Product>[] = [
      {
        code: 'P-STEEL-001',
        name: 'Steel Bolt M8',
        description: 'High tensile steel bolt M8x30',
        categoryId: 10,
        productType: 'finished',
        specifications: 'DIN 933; grade 8.8',
        standardTime: 5,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-ALU-PLATE',
        name: 'Aluminium Plate 2mm',
        description: 'AL6061 sheet 1x2m',
        categoryId: 12,
        productType: 'finished',
        specifications: '2mm x 1000mm x 2000mm',
        standardTime: 12,
        unit: 'sheet',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-PAINT-BLK',
        name: 'Black Paint 1L',
        description: 'Matte black industrial paint',
        categoryId: 15,
        productType: 'finished',
        specifications: '1L can',
        standardTime: 3,
        unit: 'can',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-COPPER-WIRE',
        name: 'Copper Wire 2.5mm',
        description: 'Single core copper electrical wire',
        categoryId: 20,
        productType: 'finished',
        specifications: '2.5mm² x 100m reel',
        standardTime: 2,
        unit: 'meter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-RUBBER-SEAL',
        name: 'O-Ring Seal 20mm',
        description: 'NBR rubber O-ring seal',
        categoryId: 18,
        productType: 'finished',
        specifications: '20mm ID x 2mm thickness',
        standardTime: 1,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-DRILL-BIT-8',
        name: 'HSS Drill Bit 8mm',
        description: 'High speed steel twist drill bit',
        categoryId: 25,
        productType: 'finished',
        specifications: '8mm diameter, 117mm length',
        standardTime: 4,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-BEARING-6205',
        name: 'Ball Bearing 6205',
        description: 'Deep groove ball bearing',
        categoryId: 22,
        productType: 'finished',
        specifications: '25mm ID x 52mm OD x 15mm width',
        standardTime: 8,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-STAINLESS-ROD',
        name: 'Stainless Steel Rod 10mm',
        description: '316L stainless steel round bar',
        categoryId: 11,
        productType: 'raw_material',
        specifications: '10mm diameter x 3m length',
        standardTime: 15,
        unit: 'meter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-PLASTIC-TUBE',
        name: 'PVC Pipe 50mm',
        description: 'Pressure rated PVC pipe',
        categoryId: 30,
        productType: 'finished',
        specifications: '50mm diameter x 6m length, PN10',
        standardTime: 6,
        unit: 'meter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-MOTOR-3PH',
        name: '3-Phase Motor 2.2kW',
        description: 'Induction motor with mounting flange',
        categoryId: 35,
        productType: 'finished',
        specifications: '2.2kW, 1450 RPM, B3 mounting',
        standardTime: 45,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-WASHER-M8',
        name: 'Flat Washer M8',
        description: 'Zinc plated flat washer',
        categoryId: 10,
        productType: 'finished',
        specifications: 'M8 x 16mm OD x 1.6mm thick',
        standardTime: 1,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-HYDRAULIC-OIL',
        name: 'Hydraulic Oil ISO 46',
        description: 'Premium hydraulic fluid',
        categoryId: 40,
        productType: 'finished',
        specifications: '20L container, ISO VG 46',
        standardTime: 2,
        unit: 'liter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-GEAR-PUMP',
        name: 'Gear Pump GP-25',
        description: 'External gear hydraulic pump',
        categoryId: 45,
        productType: 'finished',
        specifications: '25cc/rev, max 250 bar',
        standardTime: 60,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-CHAIN-ROLLER',
        name: 'Roller Chain 12B-1',
        description: 'Single strand roller chain',
        categoryId: 50,
        productType: 'finished',
        specifications: '3/4" pitch x 10ft length',
        standardTime: 8,
        unit: 'foot',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-VALVE-BALL',
        name: 'Ball Valve 1/2"',
        description: 'Brass ball valve with lever handle',
        categoryId: 55,
        productType: 'finished',
        specifications: '1/2" NPT, full port, 600 WOG',
        standardTime: 12,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-FILTER-AIR',
        name: 'Air Filter Element',
        description: 'Pleated air filter cartridge',
        categoryId: 60,
        productType: 'finished',
        specifications: '300mm x 200mm x 50mm',
        standardTime: 5,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-COUPLING-FLEX',
        name: 'Flexible Coupling 25mm',
        description: 'Jaw coupling with spider insert',
        categoryId: 65,
        productType: 'finished',
        specifications: '25mm bore, aluminum hubs',
        standardTime: 20,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-GASKET-FLANGE',
        name: 'Flange Gasket 100mm',
        description: 'Rubber flange gasket',
        categoryId: 18,
        productType: 'finished',
        specifications: '100mm PN16 full face',
        standardTime: 3,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-SPRING-COMP',
        name: 'Compression Spring 20x50',
        description: 'Heavy duty compression spring',
        categoryId: 70,
        productType: 'finished',
        specifications: '20mm OD x 50mm length, 5mm wire',
        standardTime: 7,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-RELAY-24V',
        name: 'Control Relay 24VDC',
        description: 'Industrial control relay',
        categoryId: 75,
        productType: 'finished',
        specifications: '24VDC coil, 4PDT contacts',
        standardTime: 10,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-HOSE-HYDRAULIC',
        name: 'Hydraulic Hose 3/8"',
        description: 'High pressure hydraulic hose',
        categoryId: 80,
        productType: 'finished',
        specifications: '3/8" ID, 4000 PSI, per meter',
        standardTime: 4,
        unit: 'meter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-SENSOR-TEMP',
        name: 'Temperature Sensor PT100',
        description: 'RTD temperature sensor',
        categoryId: 85,
        productType: 'finished',
        specifications: 'PT100, 3-wire, -50 to +200°C',
        standardTime: 25,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-BELT-V',
        name: 'V-Belt A42',
        description: 'Classical V-belt',
        categoryId: 90,
        productType: 'finished',
        specifications: 'A section, 42" pitch length',
        standardTime: 6,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-FUSE-32A',
        name: 'Fuse Cartridge 32A',
        description: 'HRC fuse cartridge',
        categoryId: 95,
        productType: 'finished',
        specifications: '32A, 415V, gG type',
        standardTime: 2,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-PULLEY-100',
        name: 'Cast Iron Pulley 100mm',
        description: 'Single groove V-belt pulley',
        categoryId: 100,
        productType: 'finished',
        specifications: '100mm PD, 25mm bore, A section',
        standardTime: 18,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-LUBRICANT-GEAR',
        name: 'Gear Oil SAE 90',
        description: 'Heavy duty gear lubricant',
        categoryId: 105,
        productType: 'finished',
        specifications: 'SAE 90, API GL-4, 5L container',
        standardTime: 3,
        unit: 'liter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-SWITCH-LIMIT',
        name: 'Limit Switch SPDT',
        description: 'Heavy duty limit switch',
        categoryId: 110,
        productType: 'finished',
        specifications: 'SPDT, roller lever, IP65',
        standardTime: 15,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-CYLINDER-AIR',
        name: 'Pneumatic Cylinder 50x100',
        description: 'Double acting air cylinder',
        categoryId: 115,
        productType: 'finished',
        specifications: '50mm bore x 100mm stroke',
        standardTime: 35,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-FITTING-ELBOW',
        name: 'Pipe Elbow 90° 1/2"',
        description: 'Threaded pipe elbow',
        categoryId: 120,
        productType: 'finished',
        specifications: '1/2" NPT, 90°, brass',
        standardTime: 4,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-CONTACTOR-25A',
        name: 'Motor Contactor 25A',
        description: '3-pole motor contactor',
        categoryId: 125,
        productType: 'finished',
        specifications: '25A, 415V, 24VDC coil',
        standardTime: 22,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-SHAFT-KEY',
        name: 'Parallel Key 8x7x30',
        description: 'Carbon steel parallel key',
        categoryId: 130,
        productType: 'finished',
        specifications: '8mm x 7mm x 30mm, DIN 6885',
        standardTime: 3,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-INSULATION-FOAM',
        name: 'Foam Insulation 25mm',
        description: 'Closed cell foam insulation',
        categoryId: 135,
        productType: 'finished',
        specifications: '25mm thick x 1m x 2m sheet',
        standardTime: 8,
        unit: 'sheet',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-PRESSURE-GAUGE',
        name: 'Pressure Gauge 0-10 bar',
        description: 'Glycerin filled pressure gauge',
        categoryId: 140,
        productType: 'finished',
        specifications: '100mm dial, 1/4" BSP bottom',
        standardTime: 12,
        unit: 'pcs',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
      {
        code: 'P-CABLE-ARMORED',
        name: 'Armored Cable 4x2.5mm',
        description: 'SWA armored electrical cable',
        categoryId: 145,
        productType: 'finished',
        specifications: '4 core x 2.5mm², per meter',
        standardTime: 6,
        unit: 'meter',
        isActive: true,
        createdBy: 'admin',
        updatedBy: 'admin',
      },
    ];

    await this.productRepo.save(this.productRepo.create(items));
    await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
    this.logger.log('✅ Seeded initial products.');
  }

  private async seedBoms() {
    const marker = 'boms-initialized';
    const already = await this.seedLogRepo.findOne({ where: { name: marker } });
    if (already) {
      this.logger.log('BOM seed skipped (already initialized).');
      return;
    }

    const count = await this.bomRepo.count();
    if (count > 0) {
      this.logger.log('BOM seed skipped (table not empty).');
      await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
      return;
    }

    // Build multiple BOM trees (projects) with deep levels
    const rootProductIds = [1, 2, 3];

    const makePath = (rootId: number, parentPath: string | undefined, index: number) =>
      parentPath ? `${parentPath}/${index}` : `${rootId}/${index}`;

    const createNode = async (
      rootId: number,
      parent: Bom | undefined,
      index: number,
      materialId: string,
      qtyMat: number,
      options: Partial<Bom> = {},
    ) => {
      const entity = this.bomRepo.create({
        rootProductId: rootId,
        parentId: parent?.id,
        // Default to root product when node is a material/sub-assembly without its own catalog product
        productId: options.productId ?? rootId,
        productPartPath: makePath(rootId, parent?.productPartPath, index),
        quantityOfProd: options.quantityOfProd ?? 1,
        materialId,
        quantityOfMaterials: qtyMat,
        tileHH: options.tileHH ?? '0%',
        applicationDate: options.applicationDate ?? '2025-01-01',
        endDate: options.endDate,
        tkVatTu: options.tkVatTu,
        tkh: options.tkh,
        createdBy: 'admin',
        updatedBy: 'admin',
      });
      return this.bomRepo.save(entity);
    };

    for (const rootProductId of rootProductIds) {
      // Level 1: root assembly for project
      const root = await createNode(rootProductId, undefined, 1, 'TP-THANH-PHAN-CHINH', 1, {
        productId: rootProductId,
        quantityOfProd: 1,
      });

      // Level 2: two main assemblies
      const assy1 = await createNode(rootProductId, root, 1, 'MC-THEP-TAM', 2, { tkVatTu: '152', tkh: '621' });
      const assy2 = await createNode(rootProductId, root, 2, 'MC-INOX-304', 1, { tkVatTu: '153', tkh: '621' });

      // Level 3 under assy1
      await createNode(rootProductId, assy1, 1, 'MC-SON-CHONG-RI', 1, {});
      const a1c2 = await createNode(rootProductId, assy1, 2, 'MC-DAY-THEP', 5, {});

      // Level 3 under assy2
      const a2c1 = await createNode(rootProductId, assy2, 1, 'MC-VONG-BI', 2, {});
      const a2c2 = await createNode(rootProductId, assy2, 2, 'MC-KEO-DAN', 1, {});

      // Level 4+ deep chain under a1c2
      const l4 = await createNode(rootProductId, a1c2, 1, 'MC-BANH-RANG', 2, {});
      const l5 = await createNode(rootProductId, l4, 1, 'MC-DAN-THUY-LUC', 1, {});
      await createNode(rootProductId, l5, 1, 'MC-NHAN-TEM', 4, {}); // level 6

      // Extra branches
      await createNode(rootProductId, a2c1, 3, 'MC-GIAY-NHAM', 10, {});
      await createNode(rootProductId, a2c2, 3, 'MC-MANG-PE', 2, { tkVatTu: '155' });
    }
    await this.seedLogRepo.save(this.seedLogRepo.create({ name: marker }));
    this.logger.log('✅ Seeded initial BOM data.');
  }
}
