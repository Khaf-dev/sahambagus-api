import { Injectable, Inject } from "@nestjs/common";
import {
    INewsRepository,
    NewsNotFoundException
} from '../../domain';
import { NewsResponseDto } from "../dtos";
import { NewsMapper } from "../mappers";

/**
 * ToggleFeaturedUseCase
 * 
 * Toggle featured status (only for published news)
 */
@Injectable()
export class ToggleFeaturedUseCase {
    constructor(
        @Inject(INewsRepository)
        private readonly newsRepository: INewsRepository,
    ) {}

    async execute(newsId: string, isFeatured: boolean): Promise<NewsResponseDto> {
        // 1. Find news
        const news = await this.newsRepository.findById(newsId);
        if (!news) {
            throw new NewsNotFoundException(newsId);
        }

        // 2. Toggle featured (entity validates published status)
        news.setFeatured(isFeatured);

        // 3. Save
        await this.newsRepository.save(news);

        // 4. Return DTO
        return NewsMapper.toDto(news);
    }
}