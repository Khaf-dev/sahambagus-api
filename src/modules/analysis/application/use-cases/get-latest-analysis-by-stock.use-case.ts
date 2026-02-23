import { Injectable, Inject } from '@nestjs/common';
import { IAnalysisRepository } from '../../domain';
import { AnalysisListItemDto } from '../dtos';
import { AnalysisMapper } from '../mappers';
import { ICategoryRepository } from '../../../category/domain';
import { ITagRepository } from '../../../tag/domain';
import { CategoryMapper } from '../../../category/application/mappers';
import { TagMapper } from '../../../tag/application/mappers';

/**
 * GetLatestAnalysisByStockUseCase
 * 
 * Get the latest analysis for a specific stock ticker.
 * Useful for showing "Latest BBRI Analysis" on stock detail pages.
 */
@Injectable()
export class GetLatestAnalysisByStockUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(stockTicker: string, limit: number = 5): Promise<AnalysisListItemDto[]> {
    // Get latest published analysis for this stock
    const analysisList = await this.analysisRepository.findMany({
      stockTicker,
      status: 'PUBLISHED',
      sortBy: 'publishedAt',
      sortOrder: 'desc',
      limit,
      page: 1,
    });

    // Get all unique category IDs
    const categoryIds = [...new Set(analysisList.map((a) => a.categoryId).filter(Boolean))] as string[];

    // Get all categories
    const categories = await Promise.all(
      categoryIds.map((id) => this.categoryRepository.findById(id))
    );
    const categoryMap = new Map(
      categories.filter(Boolean).map((c) => [c!.id, CategoryMapper.toDto(c!)])
    );

    // Get tags for all analysis items
    const analysisWithData = await Promise.all(
      analysisList.map(async (analysis) => {
        const tags = await this.analysisRepository.getTagsForAnalysis(analysis.id);
        const tagEntities = await this.tagRepository.findByIds(tags.map((t: any) => t.id));
        
        return AnalysisMapper.toListItemDto(
          analysis,
          analysis.categoryId ? categoryMap.get(analysis.categoryId) : null,
          TagMapper.toListDto(tagEntities),
        );
      })
    );

    return analysisWithData;
  }
}