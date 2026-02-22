import { Inject, Injectable } from "@nestjs/common";
import {
    INewsRepository,
    NewsNotFoundException
} from '../../domain';
import { UpdateNewsDto, NewsResponseDto } from "../dtos";
import { NewsMapper } from "../mappers";
import { ITagRepository } from "src/modules/tag/domain";
import { ICategoryRepository } from "src/modules/category/domain";
import { CategoryMapper } from "src/modules/category/application";
import { TagMapper } from "src/modules/tag/application";

/**
 * UpdateNewsUseCase
 * 
 * Update news content
 * Business rule: Can only update DRAFT status
 */
@Injectable()
export class UpdateNewsUseCase {
    constructor(
        @Inject(INewsRepository)
        private readonly newsRepository: INewsRepository,
        @Inject(ITagRepository)
        private readonly tagRepository: ITagRepository,
        @Inject(ICategoryRepository)
        private readonly categoryRepository: ICategoryRepository,
    ) {}

    async execute(
        newsId: string, 
        dto: UpdateNewsDto
    ): Promise<NewsResponseDto> {
        // 1. Find News
        const news = await this.newsRepository.findBySlug(newsId);
        if (!news) {
            throw new NewsNotFoundException(newsId);
        }

        // 2. Update (entity validates status)
        news.update({
            title: dto.title,
            subtitle: dto.subtitle,
            content: dto.content,
            excerpt: dto.excerpt,
            categoryId: dto.categoryId,
            featuredImageUrl: dto.featuredImageUrl,
            featuredImageAlt: dto.featuredImageAlt,
            metaTitle: dto.metaTitle,
            metaDescription: dto.metaDescription,
            metaKeywords: dto.metaKeywords,
        });

        // 3. Save
        await this.newsRepository.save(news);

        // 4. Handle Tags (if provided)
        let tagEntities = [];
        if (dto.tags !== undefined) {
            if (dto.tags.length > 0 ) {
                // Find or create tags by names
                tagEntities = await this.tagRepository.findOrCreateByNames(dto.tags);
                const tagIds = tagEntities.map((tag) => tag.id);

                // Update tags
                await this.newsRepository.addTagsToNews(news.id, tagIds);
            } else {
                // Clear all tags
                await this.newsRepository.addTagsToNews(news.id, []);
            }
        } else {
            // Tags not specified, keep existing
            const existingTags = await this.newsRepository.getTagsForNews(news.id);
            tagEntities = existingTags.map((t: any) => 
                this.tagRepository.findById(t.id),
            );
            tagEntities = (await Promise.all(tagEntities)).filter(Boolean);
        }

        // 5. Get Category
        const category = news.categoryId 
          ? await this.categoryRepository.findById(news.categoryId)
          : null;

        // 6. Return DTO
        return NewsMapper.toDto(
            news,
            category ? CategoryMapper.toDto(category) : null,
            TagMapper.toListDto(tagEntities),
        );
    }
}