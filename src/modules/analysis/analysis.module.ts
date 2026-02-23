import { Module } from '@nestjs/common';
import {
  CreateAnalysisUseCase,
  UpdateAnalysisUseCase,
  GetAnalysisBySlugUseCase,
  ListAnalysisUseCase,
  PublishAnalysisUseCase,
  SubmitForReviewUseCase,
  DeleteAnalysisUseCase,
  GetFeaturedAnalysisUseCase,
  ToggleFeaturedAnalysisUseCase,
  GetLatestAnalysisByStockUseCase,
} from './application';
import { AnalysisRepository } from './infrastructure/repositories/analysis.repository';
import { AnalysisController } from './presentation/controllers';
import { IAnalysisRepository } from './domain';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TagModule, CategoryModule],
  controllers: [AnalysisController],
  providers: [
    {
      provide: IAnalysisRepository,
      useClass: AnalysisRepository,
    },
    CreateAnalysisUseCase,
    UpdateAnalysisUseCase,
    GetAnalysisBySlugUseCase,
    ListAnalysisUseCase,
    PublishAnalysisUseCase,
    SubmitForReviewUseCase,
    DeleteAnalysisUseCase,
    GetFeaturedAnalysisUseCase,
    ToggleFeaturedAnalysisUseCase,
    GetLatestAnalysisByStockUseCase,
  ],
  exports: [
    CreateAnalysisUseCase,
    UpdateAnalysisUseCase,
    GetAnalysisBySlugUseCase,
    ListAnalysisUseCase,
    PublishAnalysisUseCase,
    SubmitForReviewUseCase,
    DeleteAnalysisUseCase,
    GetFeaturedAnalysisUseCase,
    ToggleFeaturedAnalysisUseCase,
    GetLatestAnalysisByStockUseCase,
  ],
})
export class AnalysisModule {}