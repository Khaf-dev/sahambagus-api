import { Analysis as PrismaAnalysis } from "@prisma/client";
import { AnalysisEntity } from "../../domain";

export class PrismaAnalysisMapper {
    /**
     * Prisma model -> Domain entity
     */
    static toDomain(prismaAnalysis: any): AnalysisEntity {
        return AnalysisEntity.reconstitute({
            id: prismaAnalysis.id,
            slug: prismaAnalysis.slug,
            title: prismaAnalysis.title,
            subtitle: prismaAnalysis.subtitle,
            content: prismaAnalysis.content,
            excerpt: prismaAnalysis.excerpt,
            status: prismaAnalysis.status,
            isFeatured: prismaAnalysis.isFeatured,
            stockTicker: prismaAnalysis.stockTicker,
            analysisType: prismaAnalysis.analysisType,
            marketSentiment: prismaAnalysis.marketSentiment,
            targetPrice: prismaAnalysis.targetPrice ? parseFloat(prismaAnalysis.targetPrice.toString()) : null,
            categoryId: prismaAnalysis.categoryId,
            featuredImageUrl: prismaAnalysis.featuredImageUrl,
            featuredImageAlt: prismaAnalysis.featuredImageAlt,
            metaTitle: prismaAnalysis.metaTitle,
            metaDescription: prismaAnalysis.metaDescription,
            metaKeywords: prismaAnalysis.metaKeywords,
            authorId: prismaAnalysis.authorId,
            editorId: prismaAnalysis.editorId,
            createdAt: prismaAnalysis.createdAt,
            updatedAt: prismaAnalysis.updatedAt,
            publishedAt: prismaAnalysis.publishedAt,
            archivedAt: prismaAnalysis.archivedAt,
            viewCount: prismaAnalysis.viewCount,
        });
    }

    /**
     * Domain entity -> Prisma data
     */
    static toPrisma(analysis: AnalysisEntity) {
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
            marketSentiment: analysis.marketSentiment.toString(),
            targetPrice: analysis.targetPrice,
            categoryId: analysis.categoryId,
            featuredImageUrl: analysis.featuredImageUrl,
            featuredImageAlt: analysis.featuredImageAlt,
            metaTitle: analysis.metaTitle,
            metaDescription: analysis.metaDescription,
            metaKeywords: analysis.metaKeywords,
            authorId: analysis.authorId,
            editorId: analysis.editorId,
            createdAt: analysis.createdAt,
            updatedAt: analysis.updatedAt,
            publishedAt: analysis.publishedAt,
            archivedAt: analysis.archivedAt,
            viewCount: analysis.viewCount,
            deletedAt: null,
        };
    }

    /**
     * Array of Prisma models -> Array of domain entities
     */
    static toDomainList(prismaAnalysisList: any[]): AnalysisEntity[] {
        return prismaAnalysisList.map((analysis) => this.toDomain(analysis));
    }
}