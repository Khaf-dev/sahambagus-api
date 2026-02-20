import { Injectable, Inject } from "@nestjs/common";
import { INewsRepository } from "../../domain";
import { NewsListItemDto } from "../dtos";
import { NewsMapper } from "../mappers";

/**
 * GetFeaturedNewsUseCase
 * 
 * Get featured news (published only)
 * Typically used for homepage hero selection
 */
@Injectable()
export class GetFeaturedNewsUseCase {
    constructor(
        @Inject(INewsRepository)
        private readonly newsRepository: INewsRepository,
    ) {}

    async execute(limit: number = 5): Promise<NewsListItemDto[]> {
        const newsList = await this.newsRepository.findMany({
            status: 'PUBLISHED',
            isFeatured: true,
            sortBy: 'publishedAt',
            sortOrder: 'desc',
            limit,
            page: 1,
        });

        return NewsMapper.toListDto(newsList)
    }
}