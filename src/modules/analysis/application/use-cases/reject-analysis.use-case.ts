import { Injectable, Inject } from '@nestjs/common';
import { IAnalysisRepository } from '../../domain';
import { AnalysisNotFoundException } from '../../domain/exceptions/analysis-not-found.exception';

@Injectable()
export class RejectAnalysisUseCase {
  constructor(
    @Inject(IAnalysisRepository) 
    private readonly analysisRepository: IAnalysisRepository
  ) {}

  async execute(id: string): Promise<void> {
    const analysis = await this.analysisRepository.findById(id);
    
    if (!analysis) {
      throw new AnalysisNotFoundException(id);
    }

    analysis.reject();
    await this.analysisRepository.save(analysis);
  }
}