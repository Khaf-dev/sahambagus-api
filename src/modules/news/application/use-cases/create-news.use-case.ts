import { Injectable, Inject, Logger } from '@nestjs/common';
import { 
  NewsEntity, 
  Slug, 
  INewsRepository,
  SlugAlreadyExistsException 
} from '../../domain';
import { CreateNewsDto, NewsResponseDto } from '../dtos';
import { NewsMapper } from '../mappers';
import { randomUUID } from 'crypto';
import { ITagRepository } from 'src/modules/tag/domain';
import { ICategoryRepository } from 'src/modules/category/domain';
import { CategoryMapper } from 'src/modules/category/application';
import { TagMapper } from 'src/modules/tag/application';

@Injectable()
export class CreateNewsUseCase {
  private readonly logger = new Logger(CreateNewsUseCase.name);

  constructor(
    @Inject(INewsRepository)
    private readonly newsRepository: INewsRepository,
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async execute(dto: CreateNewsDto): Promise<NewsResponseDto> {
    // 1. Generate slug from title
    const slug = Slug.fromTitle(dto.title);

    // 2. Check if slug already exists
    const exists = await this.newsRepository.existsBySlug(slug.toString());
    if (exists) {
      throw new SlugAlreadyExistsException(slug.toString());
    }

    // 3. Generate UUID
    const id = randomUUID();
    this.logger.log(`Generated UUID: ${id}`);
    this.logger.log(`UUID length: ${id.length}`);
    this.logger.log(`UUID type: ${typeof id}`);

    // 4. Create entity
    const news = NewsEntity.create({
      id,
      slug,
      title: dto.title,
      subtitle: dto.subtitle,
      content: dto.content,
      excerpt: dto.excerpt,
      isFeatured: dto.isFeatured,
      categoryId: dto.categoryId,
      authorId: dto.authorId,
      featuredImageUrl: dto.featuredImageUrl,
      featuredImageAlt: dto.featuredImageAlt,
      metaTitle: dto.metaTitle || dto.title,
      metaDescription: dto.metaDescription || dto.excerpt,
      metaKeywords: dto.metaKeywords,
    });

    this.logger.log(`Entity ID: ${news.id}`);
    this.logger.log(`Entity ID type: ${typeof news.id}`);

    // 5. Save to repository
    await this.newsRepository.save(news);

    // 6. Handle tags (if provided)
    let tagEntities = [];
    if (dto.tags && dto.tags.length > 0) {
      // Find or create tags by names
      tagEntities = await this.tagRepository.findOrCreateByNames(dto.tags);
      const tagIds = tagEntities.map((tag) => tag.id);

      // Associate tags with news
      await this.newsRepository.addTagsToNews(news.id, tagIds);
    }

    // 7. Get category (if exists)
    const category = dto.categoryId 
      ? await this.categoryRepository.findById(dto.categoryId)
      : null;

    // 8. Return DTO
    return NewsMapper.toDto(
      news,
      category ? CategoryMapper.toDto(category) : null,
      TagMapper.toListDto(tagEntities),
    );
  }
}