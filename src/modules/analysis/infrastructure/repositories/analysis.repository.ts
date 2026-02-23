import { Injectable, Logger } from '@nestjs/common';
import { AnalysisEntity, IAnalysisRepository, FindManyOptions, CountOptions } from '../../domain';
import { PrismaService } from '../../../../shared/database';
import { PrismaAnalysisMapper } from '../mappers';

@Injectable()
export class AnalysisRepository implements IAnalysisRepository {
  private readonly logger = new Logger(AnalysisRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(analysis: AnalysisEntity): Promise<void> {
    const data = PrismaAnalysisMapper.toPrisma(analysis);

    await this.prisma.analysis.upsert({
      where: { id: analysis.id },
      create: data as any,
      update: data as any,
    });

    this.logger.log(`Analysis saved: ${analysis.id}`);
  }

  async findById(id: string): Promise<AnalysisEntity | null> {
    const analysis = await this.prisma.analysis.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return analysis ? PrismaAnalysisMapper.toDomain(analysis) : null;
  }

  async findBySlug(slug: string): Promise<AnalysisEntity | null> {
    const analysis = await this.prisma.analysis.findUnique({
      where: {
        slug,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return analysis ? PrismaAnalysisMapper.toDomain(analysis) : null;
  }

  async findMany(options: FindManyOptions): Promise<AnalysisEntity[]> {
    const {
      page = 1,
      limit = 10,
      status,
      authorId,
      searchTerm,
      isFeatured,
      categoryId,
      tagId,
      stockTicker,
      stockTickers,
      analysisType,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeDeleted = false,
    } = options;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId,
        },
      };
    }

    // Analysis-specific filters
    if (stockTicker) {
      where.stockTicker = {
        equals: stockTicker,
        mode: 'insensitive',
      };
    }

    // Multi-ticker filter
    if (stockTickers && stockTickers.length > 0) {
      where.stockTicker = {
        in: stockTickers.map((ticker) => ticker.toUpperCase()),
      };
    }

    if (analysisType) {
      where.analysisType = analysisType;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const analysisList = await this.prisma.analysis.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return PrismaAnalysisMapper.toDomainList(analysisList);
  }

  async count(options: CountOptions): Promise<number> {
    const { 
      status, 
      authorId, 
      isFeatured,
      categoryId,
      tagId,
      stockTicker,
      stockTickers,
      analysisType,
      includeDeleted = false 
    } = options;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId: tagId,
        },
      };
    }

    if (stockTicker) {
      where.stockTicker = {
        equals: stockTicker,
        mode: 'insensitive',
      };
    }

    // Multi-ticker count
    if (stockTickers && stockTickers.length > 0) {
      where.stockTicker = {
        in: stockTickers.map((ticker) => ticker.toUpperCase()),
      };
    }

    if (analysisType) {
      where.analysisType = analysisType;
    }

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    return await this.prisma.analysis.count({ where });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.analysis.count({
      where: {
        slug,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.analysis.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    this.logger.log(`Analysis soft deleted: ${id}`);
  }

  async hardDelete(id: string): Promise<void> {
    await this.prisma.analysis.delete({
      where: { id },
    });

    this.logger.log(`Analysis hard deleted: ${id}`);
  }

  /**
   * Add tags to analysis (many-to-many relationship)
   */
  async addTagsToAnalysis(analysisId: string, tagIds: string[]): Promise<void> {
    // Remove existing tags
    await this.prisma.analysisTag.deleteMany({
      where: { analysisId },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await this.prisma.analysisTag.createMany({
        data: tagIds.map((tagId) => ({
          analysisId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    this.logger.log(`Tags updated for analysis: ${analysisId}`);
  }

  /**
   * Get tags for an analysis item
   */
  async getTagsForAnalysis(analysisId: string): Promise<any[]> {
    const analysisTags = await this.prisma.analysisTag.findMany({
      where: { analysisId },
      include: {
        tag: true,
      },
    });

    return analysisTags.map((at) => at.tag);
  }

  /**
   * Get category for an analysis item
   */
  async getCategoryForAnalysis(categoryId: string | null): Promise<any | null> {
    if (!categoryId) return null;

    return await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }
}