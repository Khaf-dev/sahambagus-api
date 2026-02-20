import { Injectable, Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  CategoryNotFoundException,
} from '../../domain';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new CategoryNotFoundException(categoryId);
    }

    await this.categoryRepository.delete(categoryId);
  }
}