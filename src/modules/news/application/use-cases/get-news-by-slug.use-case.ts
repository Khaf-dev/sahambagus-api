import { Inject, Injectable } from "@nestjs/common";
import {
    INewsRepository,
    NewsNotFoundException
} from '../../domain';
import { NewsResponseDto } from "../dtos";
import { NewsMapper } from "../mappers";
import { ICategoryRepository } from "src/modules/category/domain";
import { ITagRepository } from "src/modules/tag/domain";
import { CategoryMapper } from "src/modules/category/application";
import { TagMapper } from "src/modules/tag/application";

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
        @Inject(ICategoryRepository)
        private readonly categoryRepository: ICategoryRepository,
        @Inject(ITagRepository)
        private readonly tagRepository: ITagRepository,
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

        // 3. Get Category
        const category = news.categoryId
          ? await this.categoryRepository.findById(news.categoryId)
          : null;

        // 4. get tags
        const tags = await this.newsRepository.getTagsForNews(news.id); 
        const tagEntities = await this.tagRepository.findByIds(tags.map((t: any) => t.id));
        
        // 3. Return DTO
        return NewsMapper.toDto(
            news,
            category ? CategoryMapper.toDto(category) : null,
            TagMapper.toListDto(tagEntities),
        );
    }
}