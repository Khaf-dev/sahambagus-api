/**
 * CreateNewsDto
 * 
 * Input DTO for creating news
 * Used by CreateNewsUseCase
 */
export class CreateNewsDto {
    title: string;
    subtitle?: string;
    content: string;
    excerpt?: string;
    isFeatured?: boolean;
    featuredImageUrl?: string;
    featuredImageAlt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    authorId: string;
}