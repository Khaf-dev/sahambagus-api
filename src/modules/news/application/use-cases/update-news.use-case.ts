import { Inject, Injectable } from "@nestjs/common";
import {
    INewsRepository,
    NewsNotFoundException
} from '../../domain';
import { UpdateNewsDto, NewsResponseDto } from "../dtos";
import { NewsMapper } from "../mappers";

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
    ) {}

    async execute(newsId: string, dto: UpdateNewsDto): Promise<NewsResponseDto> {
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
            featuredImageUrl: dto.featuredImageUrl,
            featuredImageAlt: dto.featuredImageAlt,
            metaTitle: dto.metaTitle,
            metaDescription: dto.metaDescription,
            metaKeywords: dto.metaKeywords,
        });

        // 3. Save
        await this.newsRepository.save(news);

        // 4. Return DTO
        return NewsMapper.toDto(news);
    }
}