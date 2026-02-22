import { Category as PrismaCategory } from '@prisma/client';
import { CategoryEntity } from '../../domain';

export class PrismaCategoryMapper {
    /**
     * Prisma model -> Domain entity
     */
    static toDomain(prismaCategory: PrismaCategory): CategoryEntity {
        return CategoryEntity.reconstitute({
            id: prismaCategory.id,
            slug: prismaCategory.slug,
            name: prismaCategory.name,
            description: prismaCategory.description,
            color: prismaCategory.color,
            icon: prismaCategory.icon,
            createdAt: prismaCategory.createdAt,
            updatedAt: prismaCategory.updatedAt,
        });
    }

    /**
     *  Domain entity -> Prisma data
     */
    static toPrisma(category: CategoryEntity) {
        return {
            id: category.id,
            slug: category.slug.toString(),
            name: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            deletedAt: null,
        };
    }

    /**
     * Array to Prisma models -> Array of domain entities
     */
    static toDomainList(prismaCategories: PrismaCategory[]): CategoryEntity[] {
        return prismaCategories.map((category) => this.toDomain(category));
    }
}