import { Inject, Injectable } from '@nestjs/common';
import { INewsRepository, FindManyOptions } from '../../domain';
import { NewsListItemDto } from '../dtos';
import { NewsMapper } from '../mappers';
import { ICategoryRepository } from 'src/modules/category/domain';
import { ITagRepository } from 'src/modules/tag/domain';
import { CategoryMapper } from 'src/modules/category/application';
import { TagMapper } from 'src/modules/tag/application';

  export interface ListNewsOptions {
    page?: number;
    limit?: number;
    status?: string;
    authorId?: string;
    searchTerm?: string;
    isFeatured?: boolean;
    categoryId?: string;
    tagId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'title';
    sortOrder?: 'asc' | 'desc';
  }

/**
 * ListNewsUseCase
 * 
 * Get paginated list of news with filters.
 */
@Injectable()
export class ListNewsUseCase {
  constructor(
    @Inject(INewsRepository)
    private readonly newsRepository: INewsRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(options: ListNewsOptions) {
    // 1. Get news list
    const newsList = await this.newsRepository.findMany(options);

    // 2. Get total count
    const total = await this.newsRepository.count({
      status: options.status,
      authorId: options.authorId,
      isFeatured: options.isFeatured,
      categoryId: options.categoryId,
      tagId: options.tagId,
    });

    // 3. Get all unique category IDs
    const categoryIds = [...new Set(newsList.map((n) => n.categoryId).filter(Boolean))] as string[];

    // 4. Get all categories in one query
    const categories = await Promise.all(
      categoryIds.map((id) => this.categoryRepository.findById(id))
    );
    const categoryMap = new Map(
      categories.filter(Boolean).map((c) => [c!.id, CategoryMapper.toDto(c!)])
    )

    // 5. Get tags for all news items
    const newsWithData = await Promise.all(
      newsList.map(async (news) => {
        const tags = await this.newsRepository.getTagsForNews(news.id);
        const tagEntities = await this.tagRepository.findByIds(tags.map((t: any) => t.id));

        return NewsMapper.toListItemDto(
          news,
          news.categoryId ? categoryMap.get(news.categoryId) : null,
          TagMapper.toListDto(tagEntities),
        );
      })
    );

    // 6. Calculate pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      data: newsWithData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}