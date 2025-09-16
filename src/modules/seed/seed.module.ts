import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedLog } from './seed-log.entity';
import { Product } from '../product/product.entity';
import { MaterialCategory } from '../material-category/material-category.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeedLog, Product, MaterialCategory])],
  providers: [SeedService],
})
export class SeedModule {}
