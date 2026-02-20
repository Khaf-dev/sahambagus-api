import { Injectable, Inject } from '@nestjs/common';
import {
  CategoryEntity,
  ICategoryRepository,
  CategoryNotFoundException,
} from '../../domain';
import { CategoryResponseDto } from '../dtos';
import { CategoryMapper } from '../mappers';

@Injectable()
export class GetCategoryUseCase {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new CategoryNotFoundException(slug);
    }

    return CategoryMapper.toDto(category);
  }
}