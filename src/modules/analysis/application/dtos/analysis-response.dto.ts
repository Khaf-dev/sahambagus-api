import { CategoryResponseDto } from '../../../category/application/dtos';
import { TagResponseDto } from '../../../tag/application/dtos';

export class AnalysisResponseDto {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  excerpt: string | null;
  status: string;
  isFeatured: boolean;
  
  stockTicker: string;       // ← Analysis-specific
  analysisType: string;      // ← Analysis-specific
  targetPrice: number | null; // ← Analysis-specific
  
  categoryId: string | null;
  category: CategoryResponseDto | null;
  tags: TagResponseDto[];
  
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  
  authorId: string | null;
  editorId: string | null;
  
  viewCount: number;
  
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  archivedAt: string | null;
}