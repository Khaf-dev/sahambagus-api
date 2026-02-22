import { Injectable, Logger } from '@nestjs/common';
import { TagEntity, ITagRepository } from '../../domain';
import { PrismaService } from '../../../../shared/database';
import { PrismaTagMapper } from '../mappers';
import { randomUUID } from 'crypto';
import { Slug } from '../../../news/domain/value-objects/slug.vo';

@Injectable()
export class TagRepository implements ITagRepository {
  private readonly logger = new Logger(TagRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(tag: TagEntity): Promise<void> {
    const data = PrismaTagMapper.toPrisma(tag);

    await this.prisma.tag.upsert({
      where: { id: tag.id },
      create: data as any,
      update: data as any,
    });

    this.logger.log(`Tag saved: ${tag.id}`);
  }

  async findById(id: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    return tag ? PrismaTagMapper.toDomain(tag) : null;
  }

  async findBySlug(slug: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findUnique({
      where: { slug },
    });

    return tag ? PrismaTagMapper.toDomain(tag) : null;
  }

  async findByIds(ids: string[]): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        id: { in: ids },
      },
    });

    return PrismaTagMapper.toDomainList(tags);
  }

  async findAll(): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return PrismaTagMapper.toDomainList(tags);
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.tag.count({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    // Delete all news-tag relationships first
    await this.prisma.newsTag.deleteMany({
      where: { tagId: id },
    });

    // Then delete the tag
    await this.prisma.tag.delete({
      where: { id },
    });

    this.logger.log(`Tag deleted: ${id}`);
  }

  /**
   * Find or create tags by names (bulk operation)
   * Used when creating/updating news with tags
   */
  async findOrCreateByNames(names: string[]): Promise<TagEntity[]> {
    const tags: TagEntity[] = [];

    for (const name of names) {
      // Try to find existing tag
      let tag = await this.prisma.tag.findFirst({
        where: {
          name: {
            equals: name.trim(),
            mode: 'insensitive',
          },
        },
      });

      // Create if doesn't exist
      if (!tag) {
        const slug = Slug.fromTitle(name);
        const newTag = TagEntity.create({
          id: randomUUID(),
          slug,
          name: name.trim(),
        });

        await this.save(newTag);
        tag = PrismaTagMapper.toPrisma(newTag) as any;
        
        this.logger.log(`Auto-created tag: ${name}`);
      }

      tags.push(PrismaTagMapper.toDomain(tag));
    }

    return tags;
  }

  /**
   * Get popular tags with usage count
   */
  async getPopularTags(limit: number): Promise<{ tag: TagEntity; count: number }[]> {
    const popularTags = await this.prisma.tag.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        newsItems: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        newsItems: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return popularTags.map((tag) => ({
      tag: TagEntity.reconstitute({
        id: tag.id,
        slug: tag.slug,
        name: tag.name,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }),
      count: tag.newsItems.length,
    }));
  }
}