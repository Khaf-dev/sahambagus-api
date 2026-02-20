import { Inject, Injectable } from '@nestjs/common';
import { 
  INewsRepository,
  NewsNotFoundException 
} from '../../domain';

/**
 * DeleteNewsUseCase
 * 
 * Soft delete news.
 */
@Injectable()
export class DeleteNewsUseCase {
  constructor(
    @Inject(INewsRepository)
    private readonly newsRepository: INewsRepository,
  ) {}

  async execute(newsId: string): Promise<void> {
    // 1. Check if exists
    const news = await this.newsRepository.findById(newsId);
    if (!news) {
      throw new NewsNotFoundException(newsId);
    }

    // 2. Soft delete
    await this.newsRepository.delete(newsId);
  }
}