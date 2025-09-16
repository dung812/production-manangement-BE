import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductModule } from './modules/product/product.module';
import { MaterialCategoryModule } from './modules/material-category/material-category.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { SeedModule } from './modules/seed/seed.module';
import { BomModule } from './modules/bom/bom.module';
import configs from './common/configs';
import { getTypeOrmConfig } from './common/configs/database.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),

    // Database
    TypeOrmModule.forRoot(getTypeOrmConfig()),

    // Feature modules
    ProductModule,
    MaterialCategoryModule,
    ProductCategoryModule,
    BomModule,
    SeedModule,
  ],
})
export class AppModule {}
