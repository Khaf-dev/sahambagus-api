import { Inject, Injectable } from '@nestjs/common';
import { 
  INewsRepository,
  NewsNotFoundException 
} from '../../domain';
import { NewsResponseDto } from '../dtos';
import { NewsMapper } from '../mappers';

/**
 * PublishNewsUseCase
 * 
 * Publish news (REVIEW → PUBLISHED).
 * Business rule: Must be in REVIEW status.
 */
@Injectable()
export class PublishNewsUseCase {
  constructor(
    @Inject(INewsRepository)
    private readonly newsRepository: INewsRepository,
  ) {}

  async execute(newsId: string, editorId: string): Promise<NewsResponseDto> {
    // 1. Find news
    const news = await this.newsRepository.findById(newsId);
    if (!news) {
      throw new NewsNotFoundException(newsId);
    }

    // 2. Publish (entity validates status transition)
    news.publish(editorId);

    // 3. Save
    await this.newsRepository.save(news);

    // 4. Return DTO
    return NewsMapper.toDto(news);
  }
}