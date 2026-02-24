export class CreateAnalysisDto {
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  isFeatured?: boolean;
  stockTicker: string;       // ← Analysis-specific
  analysisType: string;      // ← Analysis-specific
  marketSentiment: string;
  targetPrice?: number;      // ← Analysis-specific
  categoryId?: string;
  tags?: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  authorId: string;
}