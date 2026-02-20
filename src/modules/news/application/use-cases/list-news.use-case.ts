import { Inject, Injectable } from '@nestjs/common';
import { INewsRepository, FindManyOptions } from '../../domain';
import { NewsListItemDto } from '../dtos';
import { NewsMapper } from '../mappers';

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
  ) {}

  async execute(options: FindManyOptions): Promise<ListNewsResult> {
    // 1. Get news list
    const newsList = await this.newsRepository.findMany(options);

    // 2. Get total count
    const total = await this.newsRepository.count({
      status: options.status,
      authorId: options.authorId,
      includeDeleted: options.includeDeleted,
    });

    // 3. Calculate pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(total / limit);

    // 4. Return result
    return {
      data: NewsMapper.toListDto(newsList),
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

/**
 * Result interface
 */
export interface ListNewsResult {
  data: NewsListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}