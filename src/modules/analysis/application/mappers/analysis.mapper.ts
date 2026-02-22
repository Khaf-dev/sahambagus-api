import { AnalysisEntity } from "../../domain";
import { AnalysisResponseDto, AnalysisListItemDto } from "../dtos";

export class AnalysisMapper {
  /**
   * Entity → Full Response DTO
   */
  static toDto(
    analysis: AnalysisEntity,
    category?: any,
    tags?: any[],
  ): AnalysisResponseDto {
    return {
      id: analysis.id,
      slug: analysis.slug.toString(),
      title: analysis.title,
      subtitle: analysis.subtitle,
      content: analysis.content,
      excerpt: analysis.excerpt,
      status: analysis.status.toString(),
      isFeatured: analysis.isFeatured,
      
      stockTicker: analysis.stockTicker.toString(),
      analysisType: analysis.analysisType.toString(),
      targetPrice: analysis.targetPrice,
      
      categoryId: analysis.categoryId,
      category: category || null,
      tags: tags || [],
      
      featuredImageUrl: analysis.featuredImageUrl,
      featuredImageAlt: analysis.featuredImageAlt,
      
      metaTitle: analysis.metaTitle,
      metaDescription: analysis.metaDescription,
      metaKeywords: analysis.metaKeywords,
      
      authorId: analysis.authorId,
      editorId: analysis.editorId,
      
      viewCount: analysis.viewCount,
      
      createdAt: analysis.createdAt.toISOString(),
      updatedAt: analysis.updatedAt.toISOString(),
      publishedAt: analysis.publishedAt ? analysis.publishedAt.toISOString() : null,
      archivedAt: analysis.archivedAt ? analysis.archivedAt.toISOString() : null,
    };
  }

  /**
   * Entity → List Item DTO (lighter)
   */
  static toListItemDto(
    analysis: AnalysisEntity,
    category?: any,
    tags?: any[],
  ): AnalysisListItemDto {
    return {
      id: analysis.id,
      slug: analysis.slug.toString(),
      title: analysis.title,
      excerpt: analysis.excerpt,
      status: analysis.status.toString(),
      isFeatured: analysis.isFeatured,
      
      stockTicker: analysis.stockTicker.toString(),
      analysisType: analysis.analysisType.toString(),
      targetPrice: analysis.targetPrice,
      
      categoryId: analysis.categoryId,
      category: category || null,
      tags: tags || [],
      
      featuredImageUrl: analysis.featuredImageUrl,
      
      authorId: analysis.authorId,
      viewCount: analysis.viewCount,
      
      createdAt: analysis.createdAt.toISOString(),
      publishedAt: analysis.publishedAt ? analysis.publishedAt.toISOString() : null,
    };
  }

  /**
   * Array of entities → Array of list DTOs
   */
  static toListDto(analysis: AnalysisEntity[]): AnalysisListItemDto[] {
    return analysis.map((item) => this.toListItemDto(item));
  }
}