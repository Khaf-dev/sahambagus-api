import { Injectable, Inject } from '@nestjs/common';
import {
  AnalysisEntity,
  IAnalysisRepository,
  AnalysisNotFoundException,
  AnalysisType,
  StockTicker,
} from '../../domain';
import { UpdateAnalysisDto, AnalysisResponseDto } from '../dtos';
import { AnalysisMapper } from '../mappers';
import { ITagRepository } from '../../../tag/domain';
import { ICategoryRepository } from '../../../category/domain';
import { CategoryMapper } from '../../../category/application/mappers';
import { TagMapper } from '../../../tag/application/mappers';

@Injectable()
export class UpdateAnalysisUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(
    analysisId: string,
    dto: UpdateAnalysisDto,
  ): Promise<AnalysisResponseDto> {
    // 1. Find analysis
    const analysis = await this.analysisRepository.findById(analysisId);
    if (!analysis) {
      throw new AnalysisNotFoundException(analysisId);
    }

    // 2. Prepare value objects if provided
    const stockTicker = dto.stockTicker 
      ? StockTicker.create(dto.stockTicker) 
      : undefined;
    
    const analysisType = dto.analysisType 
      ? AnalysisType.fromString(dto.analysisType) 
      : undefined;

    // 3. Update analysis entity
    analysis.update({
      title: dto.title,
      subtitle: dto.subtitle,
      content: dto.content,
      excerpt: dto.excerpt,
      stockTicker,
      analysisType,
      targetPrice: dto.targetPrice,
      categoryId: dto.categoryId,
      featuredImageUrl: dto.featuredImageUrl,
      featuredImageAlt: dto.featuredImageAlt,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      metaKeywords: dto.metaKeywords,
    });

    // 4. Save analysis
    await this.analysisRepository.save(analysis);

    // 5. Handle tags
    let tagEntities = [];
    if (dto.tags !== undefined) {
      if (dto.tags.length > 0) {
        tagEntities = await this.tagRepository.findOrCreateByNames(dto.tags);
        const tagIds = tagEntities.map((tag) => tag.id);
        await this.analysisRepository.addTagsToAnalysis(analysis.id, tagIds);
      } else {
        // Clear all tags
        await this.analysisRepository.addTagsToAnalysis(analysis.id, []);
      }
    } else {
      // Tags not specified, keep existing
      const existingTags = await this.analysisRepository.getTagsForAnalysis(analysis.id);
      tagEntities = existingTags.map((t: any) =>
        this.tagRepository.findById(t.id),
      );
      tagEntities = (await Promise.all(tagEntities)).filter(Boolean);
    }

    // 6. Get category
    const category = analysis.categoryId
      ? await this.categoryRepository.findById(analysis.categoryId)
      : null;

    // 7. Return DTO
    return AnalysisMapper.toDto(
      analysis,
      category ? CategoryMapper.toDto(category) : null,
      TagMapper.toListDto(tagEntities),
    );
  }
}