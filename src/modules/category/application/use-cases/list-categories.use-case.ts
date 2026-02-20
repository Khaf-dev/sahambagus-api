import { Injectable, Inject } from '@nestjs/common';
import { ICategoryRepository } from '../../domain';
import { CategoryResponseDto } from '../dtos';
import { CategoryMapper } from '../mappers';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return CategoryMapper.toListDto(categories);
  }
}