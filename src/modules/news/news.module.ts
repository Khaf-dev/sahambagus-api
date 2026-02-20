import { Module } from '@nestjs/common';
import {
    CreateNewsUseCase,
    UpdateNewsUseCase,
    GetNewsBySlugUseCase,
    ListNewsUseCase,
    PublishNewsUseCase,
    SubmitForReviewUseCase,
    DeleteNewsUseCase,
    GetFeaturedNewsUseCase,
    ToggleFeaturedUseCase,
} from './application';
import { NewsRepository } from './infrastructure/repositories/news.repository';
import { INewsRepository } from './domain';
import { NewsController } from './presentation/controllers';

/**
 * News Module
 * 
 * Aggregates all news-related components.
 * Follows Clean Architecture dependency injection.
 */
@Module({
  controllers: [NewsController],
  providers: [
    // Repository
    {
      provide: INewsRepository,
      useClass: NewsRepository,
    },
    
    // Use Cases
    CreateNewsUseCase,
    UpdateNewsUseCase,
    GetNewsBySlugUseCase,
    ListNewsUseCase,
    PublishNewsUseCase,
    SubmitForReviewUseCase,
    DeleteNewsUseCase,
    GetFeaturedNewsUseCase,
    ToggleFeaturedUseCase,
  ],
  exports: [
    // Export use cases for controllers
    CreateNewsUseCase,
    UpdateNewsUseCase,
    GetNewsBySlugUseCase,
    ListNewsUseCase,
    PublishNewsUseCase,
    SubmitForReviewUseCase,
    DeleteNewsUseCase,
    GetFeaturedNewsUseCase,
    ToggleFeaturedUseCase,
  ],
})
export class NewsModule {}