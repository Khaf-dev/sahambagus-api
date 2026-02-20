import { CategoryEntity } from '../entities/category.entity';

export interface ICategoryRepository {
  save(category: CategoryEntity): Promise<void>;
  findById(id: string): Promise<CategoryEntity | null>;
  findBySlug(slug: string): Promise<CategoryEntity | null>;
  findAll(): Promise<CategoryEntity[]>;
  existsByName(name: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}

export const ICategoryRepository = Symbol('ICategoryRepository');