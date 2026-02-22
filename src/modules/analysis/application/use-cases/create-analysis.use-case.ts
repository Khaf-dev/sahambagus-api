import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { 
  AnalysisEntity, 
  IAnalysisRepository,
  SlugAlreadyExistsException,
  AnalysisType,
  StockTicker,
} from '../../domain';
import { Slug } from '../../../news/domain/value-objects/slug.vo';
import { CreateAnalysisDto, AnalysisResponseDto } from '../dtos';
import { AnalysisMapper } from '../mappers';
import { ITagRepository } from '../../../tag/domain';
import { ICategoryRepository } from '../../../category/domain';
import { CategoryMapper } from '../../../category/application/mappers';
import { TagMapper } from '../../../tag/application/mappers';

@Injectable()
export class CreateAnalysisUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateAnalysisDto): Promise<AnalysisResponseDto> {
    // 1. Generate slug from title
    const slug = Slug.fromTitle(dto.title);

    // 2. Check if slug already exists
    const exists = await this.analysisRepository.existsBySlug(slug.toString());
    if (exists) {
      throw new SlugAlreadyExistsException(slug.toString());
    }

    // 3. Create value objects
    const stockTicker = StockTicker.create(dto.stockTicker);
    const analysisType = AnalysisType.fromString(dto.analysisType);

    // 4. Create entity
    const analysis = AnalysisEntity.create({
      id: randomUUID(),
      slug,
      title: dto.title,
      subtitle: dto.subtitle,
      content: dto.content,
      excerpt: dto.excerpt,
      isFeatured: dto.isFeatured,
      stockTicker,
      analysisType,
      targetPrice: dto.targetPrice,
      categoryId: dto.categoryId,
      authorId: dto.authorId,
      featuredImageUrl: dto.featuredImageUrl,
      featuredImageAlt: dto.featuredImageAlt,
      metaTitle: dto.metaTitle || dto.title,
      metaDescription: dto.metaDescription || dto.excerpt,
      metaKeywords: dto.metaKeywords,
    });

    // 5. Save analysis
    await this.analysisRepository.save(analysis);

    // 6. Handle tags
    let tagEntities = [];
    if (dto.tags && dto.tags.length > 0) {
      tagEntities = await this.tagRepository.findOrCreateByNames(dto.tags);
      const tagIds = tagEntities.map((tag) => tag.id);
      await this.analysisRepository.addTagsToAnalysis(analysis.id, tagIds);
    }

    // 7. Get category
    const category = dto.categoryId
      ? await this.categoryRepository.findById(dto.categoryId)
      : null;

    // 8. Return DTO
    return AnalysisMapper.toDto(
      analysis,
      category ? CategoryMapper.toDto(category) : null,
      TagMapper.toListDto(tagEntities),
    );
  }
}