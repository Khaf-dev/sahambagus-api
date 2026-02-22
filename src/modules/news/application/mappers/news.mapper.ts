import { NewsEntity } from "../../domain";
import { NewsResponseDto, NewsListItemDto } from "../dtos";

/**
 * NewsMapper
 * 
 * Maps between domain entities and DTOs
 * Penting: Never expose entities directly to API
 */
export class NewsMapper {
    /**
     * Entity -> Full response DTO
     */
    static toDto(
        news: NewsEntity,
        category?: any,
        tags?: any[],

    ): NewsResponseDto {
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
            category: category || null,
            tags: tags || [],

            featuredImageUrl: news.featuredImageUrl,
            featuredImageAlt: news.featuredImageAlt,
    
            metaTitle: news.metaTitle,
            metaDescription: news.metaDescription,
            metaKeywords: news.metaKeywords,
    
            authorId: news.authorId,
            editorId: news.editorId,
    
            viewCount: news.viewCount,
    
            createdAt: news.createdAt.toISOString(),
            updatedAt: news.updatedAt.toISOString(),
            publishedAt: news.publishedAt ? news.publishedAt.toISOString() : null, // ← Fix
            archivedAt: news.archivedAt ? news.archivedAt.toISOString() : null,     // ← Fix
        };
    }

    /**
     * Entity -> list item DTO (lighter)
     */
    static toListItemDto(
        news: NewsEntity,
        category?: any,
        tags?: any[],
    ): NewsListItemDto {
        return {
            id: news.id,
            slug: news.slug.toString(),
            title: news.title,
            excerpt: news.excerpt,
            status: news.status.toString(),

            isFeatured: news.isFeatured,

            categoryId: news.categoryId,
            category: category || null,
            tags: tags || [],
            
            featuredImageUrl: news.featuredImageUrl,

            authorId: news.authorId,
            viewCount: news.viewCount,

            createdAt: news.createdAt.toISOString(),
            publishedAt: news.publishedAt ? news.publishedAt.toISOString() : null,
        };
    }

    /**
     * Array of entities -> Array of list DTOs
     */
    static toListDto(newsList: NewsEntity[]): NewsListItemDto[] {
        return newsList.map((news) => NewsMapper.toListItemDto(news));
    }
}