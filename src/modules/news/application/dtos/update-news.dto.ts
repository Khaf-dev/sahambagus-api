/**
 * UpdateNewsDto
 * 
 * Input DTO for updating news
 * All fields optional (partial update)
 */
export class UpdateNewsDto {
    title?: string;
    subtitle?: string;
    content?: string;
    excerpt?: string;
    isFeatured?: boolean;
    categoryId?: string;
    tags?: string[];
    featuredImageUrl?: string;
    featuredImageAlt?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
}