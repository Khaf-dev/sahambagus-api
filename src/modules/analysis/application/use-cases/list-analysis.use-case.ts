import { Injectable, Inject } from '@nestjs/common';
import { IAnalysisRepository } from '../../domain';
import { AnalysisListItemDto } from '../dtos';
import { AnalysisMapper } from '../mappers';
import { ICategoryRepository } from '../../../category/domain';
import { ITagRepository } from '../../../tag/domain';
import { CategoryMapper } from '../../../category/application/mappers';
import { TagMapper } from '../../../tag/application/mappers';

export interface ListAnalysisOptions {
  page?: number;
  limit?: number;
  status?: string;
  authorId?: string;
  searchTerm?: string;
  isFeatured?: boolean;
  categoryId?: string;
  tagId?: string;
  stockTicker?: string;   // ← Analysis-specific
  stockTickers?: string[];
  analysisType?: string;  // ← Analysis-specific
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class ListAnalysisUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(options: ListAnalysisOptions) {
    // 1. Get analysis list
    const analysisList = await this.analysisRepository.findMany(options);

    // 2. Get total count
    const total = await this.analysisRepository.count({
      status: options.status,
      authorId: options.authorId,
      isFeatured: options.isFeatured,
      categoryId: options.categoryId,
      tagId: options.tagId,
      stockTicker: options.stockTicker,
      stockTickers: options.stockTickers,
      analysisType: options.analysisType,
    });

    // 3. Get all unique category IDs
    const categoryIds = [...new Set(analysisList.map((a) => a.categoryId).filter(Boolean))] as string[];

    // 4. Get all categories in one query
    const categories = await Promise.all(
      categoryIds.map((id) => this.categoryRepository.findById(id))
    );
    const categoryMap = new Map(
      categories.filter(Boolean).map((c) => [c!.id, CategoryMapper.toDto(c!)])
    );

    // 5. Get all unique IDs
    const authorIds = [...new Set(analysisList.map((a) => a.authorId).filter(Boolean))] as string[];

    // 6. Get all authors in one query
    const authors = await Promise.all(
      authorIds.map((id) => this.analysisRepository.getAuthorForAnalysis(id))
    );
    const authorMap = new Map(
      authors.filter(Boolean).map((a) => [a!.id, a!])
    );

    // 7. Get tags for all analysis items
    const analysisWithData = await Promise.all(
      analysisList.map(async (analysis) => {
        const tags = await this.analysisRepository.getTagsForAnalysis(analysis.id);
        const tagEntities = await this.tagRepository.findByIds(tags.map((t: any) => t.id));
        
        return AnalysisMapper.toListItemDto(
          analysis,
          analysis.categoryId ? categoryMap.get(analysis.categoryId) : null,
          TagMapper.toListDto(tagEntities),
          analysis.authorId ? authorMap.get(analysis.authorId) : null,
        );
      })
    );

    // 8. Calculate pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      items: analysisWithData,
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