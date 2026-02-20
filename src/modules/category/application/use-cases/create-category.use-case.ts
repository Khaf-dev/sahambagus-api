import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CategoryEntity,
  ICategoryRepository,
  CategoryAlreadyExistsException,
} from '../../domain';
import { Slug } from '../../../news/domain/value-objects/slug.vo';
import { CreateCategoryDto, CategoryResponseDto } from '../dtos';
import { CategoryMapper } from '../mappers';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // 1. Check if category already exists
    const exists = await this.categoryRepository.existsByName(dto.name);
    if (exists) {
      throw new CategoryAlreadyExistsException(dto.name);
    }

    // 2. Generate slug from name
    const slug = Slug.fromTitle(dto.name);

    // 3. Create entity
    const category = CategoryEntity.create({
      id: randomUUID(),
      slug,
      name: dto.name,
      description: dto.description,
      color: dto.color,
      icon: dto.icon,
    });

    // 4. Save
    await this.categoryRepository.save(category);

    // 5. Return DTO
    return CategoryMapper.toDto(category);
  }
}