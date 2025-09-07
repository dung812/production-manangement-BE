import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from './modules/product/product.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Product],
  synchronize: true,
});

async function run() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Product);

  const count = await repo.count();
  if (count > 0) {
    console.log('Seed skipped: products already exist.');
    await AppDataSource.destroy();
    return;
  }

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
  ];

  await repo.save(repo.create(items));
  console.log('✅ Seeded products');
  await AppDataSource.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
