import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedLog } from './seed-log.entity';
import { Product } from '../product/product.entity';
import { MaterialCategory } from '../material-category/material-category.entity';
import { ProductCategory } from '../product-category/product-category.entity';
import { SeedService } from './seed.service';
import { Bom } from '../bom/bom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeedLog, Product, MaterialCategory, ProductCategory, Bom])],
  providers: [SeedService],
})
export class SeedModule {}
