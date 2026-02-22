import { Tag as PrismaTag } from '@prisma/client';
import { TagEntity } from '../../domain';

export class PrismaTagMapper {
    /**
     * Prisma model -> Domain entity
     */
    static toDomain(prismaTag: PrismaTag): TagEntity {
    return TagEntity.reconstitute({
      id: prismaTag.id,
      slug: prismaTag.slug,
      name: prismaTag.name,
      createdAt: prismaTag.createdAt,
      updatedAt: prismaTag.updatedAt,
    });
  }

  /**
   * Domain entity → Prisma data
   */
  static toPrisma(tag: TagEntity) {
    return {
      id: tag.id,
      slug: tag.slug.toString(),
      name: tag.name,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  /**
   * Array of Prisma models → Array of domain entities
   */
  static toDomainList(prismaTags: PrismaTag[]): TagEntity[] {
    return prismaTags.map((tag) => this.toDomain(tag));
  }
}