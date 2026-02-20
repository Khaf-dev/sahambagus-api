import { CategoryEntity } from '../../domain';
import { CategoryResponseDto } from '../dtos';

export class CategoryMapper {
  /**
   * Entity → Response DTO
   */
  static toDto(category: CategoryEntity): CategoryResponseDto {
    return {
      id: category.id,
      slug: category.slug.toString(),
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  /**
   * Array of entities → Array of DTOs
   */
  static toListDto(categories: CategoryEntity[]): CategoryResponseDto[] {
    return categories.map((category) => this.toDto(category));
  }
}