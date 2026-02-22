import { Injectable, Logger } from '@nestjs/common';
import { 
  INewsRepository, 
  NewsEntity,
  FindManyOptions,
  CountOptions 
} from '../../domain';
import { PrismaService } from '../../../../shared/database';
import { PrismaNewsMapper } from '../mappers';

@Injectable()
export class NewsRepository implements INewsRepository {
  private readonly logger = new Logger(NewsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  
  async save(news: NewsEntity): Promise<void> {
    const data = PrismaNewsMapper.toPrisma(news);
    
    this.logger.log(`Saving news with ID: ${data.id}`);
    this.logger.log(`Data ID type: ${typeof data.id}`);
    this.logger.log(`Full data: `, JSON.stringify(data, null, 2));
    
    await this.prisma.news.upsert({
      where: { id: news.id },
      create: data as any,
      update: data as any,
    });

    this.logger.log(`News saved: ${news.id}`);
  }

  async findById(id: string): Promise<NewsEntity | null> {
    const news = await this.prisma.news.findUnique({
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

    return news ? PrismaNewsMapper.toDomain(news) : null;
  }
  
  async findBySlug(slug: string): Promise<NewsEntity | null> {
    const news = await this.prisma.news.findUnique({
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

    return news ? PrismaNewsMapper.toDomain(news) : null;
  }
  
  async findMany(options: FindManyOptions): Promise<NewsEntity[]> {
    const {
      page = 1,
      limit = 10,
      status,
      authorId,
      searchTerm,
      isFeatured,
      categoryId,
      tagId,
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
    
    const newsList = await this.prisma.news.findMany({
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
    
    return PrismaNewsMapper.toDomainList(newsList);
  }
  
  async count(options: CountOptions): Promise<number> {
    const { 
      status, 
      authorId, 
      isFeatured,
      categoryId,
      tagId,
      includeDeleted = false,
      
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
      
      if (!includeDeleted) {
        where.deletedAt = null;
    }
    
    return await this.prisma.news.count({ where });
  }
  
  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.news.count({
      where: { 
        slug,
        deletedAt: null,
      },
    });
    
    return count > 0;
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.news.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
      },
    });
    
    this.logger.log(`News soft deleted: ${id}`);
  }
  
  async hardDelete(id: string): Promise<void> {
    await this.prisma.news.delete({
      where: { id },
    });
    
    this.logger.warn(`News hard deleted: ${id}`);
  }

  /**
   * Add tags to news (many-to-many relationship)
   */
  async addTagsToNews(newsId: string, tagIds: string[]): Promise<void> {
    // Remove existing tags
    await this.prisma.newsTag.deleteMany({
      where: { newsId },
    });

    // Add new tags
    if (tagIds.length > 0) {
      await this.prisma.newsTag.createMany({
        data: tagIds.map((tagId) => ({
          newsId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    this.logger.log(`Tags updated for news: ${newsId}`);
  }

  /**
   * Get tags for a news item
   */
  async getTagsForNews(newsId: string): Promise<any[]> {
    const newsTags = await this.prisma.newsTag.findMany({
      where: { newsId },
      include: {
        tag: true,
      },
    });

    return newsTags.map((nt) => nt.tag);
  }

  async getCategoryForNews(categoryId: string | null): Promise<any | null> {
    if (!categoryId) return null;

    return await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }
}