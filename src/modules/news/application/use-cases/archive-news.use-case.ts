import { Injectable, Inject } from '@nestjs/common';
import { INewsRepository } from '../../domain';
import { NewsNotFoundException } from '../../domain/exceptions/news-not-found.exception';

@Injectable()
export class ArchiveNewsUseCase {
  constructor(
    @Inject(INewsRepository) 
    private readonly newsRepository: INewsRepository
  ) {}

  async execute(id: string): Promise<void> {
    const news = await this.newsRepository.findById(id);
    
    if (!news) {
      throw new NewsNotFoundException(id);
    }

    news.archive();
    await this.newsRepository.save(news);
  }
}