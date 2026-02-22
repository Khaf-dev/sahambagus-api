import { News as PrismaNews } from '@prisma/client';
import { NewsEntity, Slug, ContentStatus } from '../../domain';

/**
 * PrismaNewsMapper
 * 
 * Maps between Prisma models and Domain entities.
 * Handles the impedance mismatch between database and domain.
 */
export class PrismaNewsMapper {
  /**
   * Prisma Model → Domain Entity
   */
  static toDomain(prismaNews: PrismaNews): NewsEntity {
    return NewsEntity.reconstitute({
      id: prismaNews.id,
      slug: prismaNews.slug,
      title: prismaNews.title,
      subtitle: prismaNews.subtitle,
      content: prismaNews.content,
      excerpt: prismaNews.excerpt,
      status: prismaNews.status,
      isFeatured: prismaNews.isFeatured,
      categoryId: prismaNews.categoryId,
      featuredImageUrl: prismaNews.featuredImageUrl,
      featuredImageAlt: prismaNews.featuredImageAlt,
      metaTitle: prismaNews.metaTitle,
      metaDescription: prismaNews.metaDescription,
      metaKeywords: prismaNews.metaKeywords,
      authorId: prismaNews.authorId,
      editorId: prismaNews.editorId,
      createdAt: prismaNews.createdAt,
      updatedAt: prismaNews.updatedAt,
      publishedAt: prismaNews.publishedAt,
      archivedAt: prismaNews.archivedAt,
      viewCount: prismaNews.viewCount,
    });
  }

  /**
   * Domain Entity → Prisma Data
   */
  static toPrisma(news: NewsEntity) {
    return {
      id: news.id,
      slug: news.slug.toString(),
      title: news.title,
      subtitle: news.subtitle,
      content: news.content,
      excerpt: news.excerpt,
      status: news.status.toString(),
      isFeatured: news.isFeatured,
      categoryId: news.categoryId,
      featuredImageUrl: news.featuredImageUrl,
      featuredImageAlt: news.featuredImageAlt,
      metaTitle: news.metaTitle,
      metaDescription: news.metaDescription,
      metaKeywords: news.metaKeywords,
      authorId: news.authorId,
      editorId: news.editorId,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      publishedAt: news.publishedAt,
      archivedAt: news.archivedAt,
      viewCount: news.viewCount,
      deletedAt: null, // Soft delete handled separately
    };
  }

  /**
   * Array of Prisma → Array of Domain
   */
  static toDomainList(prismaNewsList: PrismaNews[]): NewsEntity[] {
    return prismaNewsList.map((news) => PrismaNewsMapper.toDomain(news));
  }
}