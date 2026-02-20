import { Injectable, Inject } from '@nestjs/common';
import {
  CategoryEntity,
  ICategoryRepository,
  CategoryNotFoundException,
} from '../../domain';
import { UpdateCategoryDto, CategoryResponseDto } from '../dtos';
import { CategoryMapper } from '../mappers';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // 1. Find category
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    // 2. Update
    category.update(dto);

    // 3. Save
    await this.categoryRepository.save(category);

    // 4. Return DTO
    return CategoryMapper.toDto(category);
  }
}