import { Injectable, Inject } from '@nestjs/common';
import {
  IAnalysisRepository,
  AnalysisNotFoundException,
} from '../../domain';

@Injectable()
export class DeleteAnalysisUseCase {
  constructor(
    @Inject(IAnalysisRepository)
    private readonly analysisRepository: IAnalysisRepository,
  ) {}

  async execute(analysisId: string): Promise<void> {
    // 1. Find analysis
    const analysis = await this.analysisRepository.findById(analysisId);
    if (!analysis) {
      throw new AnalysisNotFoundException(analysisId);
    }

    // 2. Soft delete
    await this.analysisRepository.delete(analysisId);
  }
}