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

/**
 * ToggleFeaturedAnalysisUseCase
 * 
 * Toggle featured status (only for published analysis).
 */
@Injectable()
export class ToggleFeaturedAnalysisUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(analysisId: string, isFeatured: boolean): Promise<AnalysisResponseDto> {
    // 1. Find analysis
    const analysis = await this.analysisRepository.findById(analysisId);
    if (!analysis) {
      throw new AnalysisNotFoundException(analysisId);
    }

    // 2. Toggle featured (entity validates published status)
    analysis.setFeatured(isFeatured);

    // 3. Save
    await this.analysisRepository.save(analysis);

    // 4. Get category
    const category = analysis.categoryId
      ? await this.categoryRepository.findById(analysis.categoryId)
      : null;

    // 5. Get tags
    const tags = await this.analysisRepository.getTagsForAnalysis(analysis.id);
    const tagEntities = await this.tagRepository.findByIds(tags.map((t: any) => t.id));

    // 6. Return DTO
    return AnalysisMapper.toDto(
      analysis,
      category ? CategoryMapper.toDto(category) : null,
      TagMapper.toListDto(tagEntities),
    );
  }
}