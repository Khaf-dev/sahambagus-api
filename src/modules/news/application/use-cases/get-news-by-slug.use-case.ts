import { Inject, Injectable } from "@nestjs/common";
import {
    INewsRepository,
    NewsNotFoundException
} from '../../domain';
import { NewsResponseDto } from "../dtos";
import { NewsMapper } from "../mappers";

/**
 * GetNewsBySlugUseCase
 * 
 * Get single news by slug
 * Increment view counter  if published
 */
@Injectable()
export class GetNewsBySlugUseCase {
    constructor(
        @Inject(INewsRepository)
        private readonly newsRepository: INewsRepository,
    ) {}

    async execute(slug: string): Promise<NewsResponseDto> {
        // 1. Find News
        const news = await this.newsRepository.findBySlug(slug);
        if (!news) {
            throw new NewsNotFoundException(slug);
        }

        // 2. Increment views (only for published)
        news.incrementViews();
        await this.newsRepository.save(news);
        
        // 3. Return DTO
        return NewsMapper.toDto(news);
    }
}