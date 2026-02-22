import { CategoryResponseDto } from "src/modules/category/application";
import { TagResponseDto } from "src/modules/tag/application";

/**
 * NewsResponseDto
 * 
 * Output DTO for news.
 * This is what API returns to clients
 */
export class NewsResponseDto {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    content: string;
    excerpt: string | null;
    status: string;

    isFeatured: boolean;

    categoryId: string | null;
    category: CategoryResponseDto | null;
    tags: TagResponseDto[];
    
    featuredImageUrl: string | null;
    featuredImageAlt: string | null;

    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;

    authorId: string | null;
    editorId: string | null;

    viewCount: number;

    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
    publishedAt: string | null; // ISO 8601
    archivedAt: string | null; // ISO 8601
}