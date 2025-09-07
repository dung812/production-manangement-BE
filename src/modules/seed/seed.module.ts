import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedLog } from './seed-log.entity';
import { Product } from '../product/product.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeedLog, Product])],
  providers: [SeedService],
})
export class SeedModule {}
