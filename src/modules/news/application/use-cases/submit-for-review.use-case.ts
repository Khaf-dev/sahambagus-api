import { Inject, Injectable } from '@nestjs/common';
import { 
  INewsRepository,
  NewsNotFoundException 
} from '../../domain';
import { NewsResponseDto } from '../dtos';
import { NewsMapper } from '../mappers';

/**
 * SubmitForReviewUseCase
 * 
 * Submit news for review (DRAFT → REVIEW).
 */
@Injectable()
export class SubmitForReviewUseCase {
  constructor(
    @Inject(INewsRepository)
    private readonly newsRepository: INewsRepository,
  ) {}

  async execute(newsId: string): Promise<NewsResponseDto> {
    // 1. Find news
    const news = await this.newsRepository.findById(newsId);
    if (!news) {
      throw new NewsNotFoundException(newsId);
    }

    // 2. Submit for review
    news.submitForReview();

    // 3. Save
    await this.newsRepository.save(news);

    // 4. Return DTO
    return NewsMapper.toDto(news);
  }
}