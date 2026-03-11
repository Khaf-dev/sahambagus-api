import { CategoryResponseDto } from "src/modules/category/application";
import { TagResponseDto } from "src/modules/tag/application";

/**
 * NewsListItemDto
 * 
 * Lighter DTO for list endpoints
 * Does not include full content
 */
export class NewsListItemDto {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    status: string;

    isFeatured: boolean;

    categoryId: string | null;
    category: CategoryResponseDto | null;
    tags: TagResponseDto[];
    
    featuredImageUrl: string | null;

    authorId: string | null;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    viewCount: number;

    createdAt: string;
    publishedAt: string | null;
}