import { CategoryResponseDto } from '../../../category/application/dtos';
import { TagResponseDto } from '../../../tag/application/dtos';

export class AnalysisListItemDto {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: string;
  isFeatured: boolean;
  
  stockTicker: string;
  analysisType: string;
  targetPrice: number | null;
  
  categoryId: string | null;
  category: CategoryResponseDto | null;
  tags: TagResponseDto[];
  
  featuredImageUrl: string | null;
  
  authorId: string | null;
  viewCount: number;
  
  createdAt: string;
  publishedAt: string | null;
}