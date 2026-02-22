import { Injectable, Inject } from '@nestjs/common';
import {
  IAnalysisRepository,
  AnalysisNotFoundException,
} from '../../domain';
import { AnalysisResponseDto } from '../dtos';
import { AnalysisMapper } from '../mappers';
import { ICategoryRepository } from '../../../category/domain';
import { ITagRepository } from '../../../tag/domain';
import { CategoryMapper } from '../../../category/application/mappers';
import { TagMapper } from '../../../tag/application/mappers';

@Injectable()
export class GetAnalysisBySlugUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(slug: string): Promise<AnalysisResponseDto> {
    // 1. Find analysis
    const analysis = await this.analysisRepository.findBySlug(slug);
    if (!analysis) {
      throw new AnalysisNotFoundException(slug);
    }

    // 2. Increment view counter (only for published)
    if (analysis.status.isPublished()) {
      analysis.incrementViews();
      await this.analysisRepository.save(analysis);
    }

    // 3. Get category
    const category = analysis.categoryId
      ? await this.categoryRepository.findById(analysis.categoryId)
      : null;

    // 4. Get tags
    const tags = await this.analysisRepository.getTagsForAnalysis(analysis.id);
    const tagEntities = await this.tagRepository.findByIds(tags.map((t: any) => t.id));

    // 5. Return DTO
    return AnalysisMapper.toDto(
      analysis,
      category ? CategoryMapper.toDto(category) : null,
      TagMapper.toListDto(tagEntities),
    );
  }
}