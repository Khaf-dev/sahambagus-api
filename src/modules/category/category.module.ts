import { Module } from '@nestjs/common';
import {
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  DeleteCategoryUseCase,
} from './application';
import { CategoryRepository } from './infrastructure';
import { CategoryController } from './presentation/controllers';
import { ICategoryRepository } from './domain';

@Module({
  controllers: [CategoryController],
  providers: [
    {
      provide: ICategoryRepository,
      useClass: CategoryRepository,
    },
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase,
  ],
  exports: [
    ICategoryRepository,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    GetCategoryUseCase,
    ListCategoriesUseCase,
    DeleteCategoryUseCase,
  ],
})
export class CategoryModule {}