export class UpdateAnalysisDto {
  title?: string;
  subtitle?: string;
  content?: string;
  excerpt?: string;
  isFeatured?: boolean;
  stockTicker?: string;
  analysisType?: string;
  targetPrice?: number;
  categoryId?: string;
  tags?: string[];
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}