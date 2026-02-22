import { AnalysisEntity } from '../entities/analysis-entity';

export interface FindManyOptions {
  page?: number;
  limit?: number;
  status?: string;
  authorId?: string;
  searchTerm?: string;
  isFeatured?: boolean;
  categoryId?: string;
  tagId?: string;
  stockTicker?: string;  // ← Analysis-specific
  analysisType?: string; // ← Analysis-specific
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface CountOptions {
  status?: string;
  authorId?: string;
  isFeatured?: boolean;
  categoryId?: string;
  tagId?: string;
  stockTicker?: string;  // ← Analysis-specific
  analysisType?: string; // ← Analysis-specific
  includeDeleted?: boolean;
}

export interface IAnalysisRepository {
  save(analysis: AnalysisEntity): Promise<void>;
  findById(id: string): Promise<AnalysisEntity | null>;
  findBySlug(slug: string): Promise<AnalysisEntity | null>;
  findMany(options: FindManyOptions): Promise<AnalysisEntity[]>;
  count(options: CountOptions): Promise<number>;
  existsBySlug(slug: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
  
  // Tag management methods
  addTagsToAnalysis(analysisId: string, tagIds: string[]): Promise<void>;
  getTagsForAnalysis(analysisId: string): Promise<any[]>;
  getCategoryForAnalysis(categoryId: string | null): Promise<any | null>;
}

export const IAnalysisRepository = Symbol('IAnalysisRepository');