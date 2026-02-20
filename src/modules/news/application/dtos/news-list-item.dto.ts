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
    featuredImageUrl: string | null;

    authorId: string | null;
    viewCount: number;

    createdAt: string;
    publishedAt: string | null;
}