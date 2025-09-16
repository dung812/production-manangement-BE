import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialCategory } from './material-category.entity';
import { MaterialCategoryService } from './material-category.service';
import { MaterialCategoryController } from './material-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialCategory])],
  controllers: [MaterialCategoryController],
  providers: [MaterialCategoryService],
  exports: [MaterialCategoryService],
})
export class MaterialCategoryModule {}
