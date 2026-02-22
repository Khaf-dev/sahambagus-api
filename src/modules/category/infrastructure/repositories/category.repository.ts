import { Injectable, Logger } from "@nestjs/common";
import { CategoryEntity, ICategoryRepository } from "../../domain";
import { PrismaService } from "src/shared/database";
import { PrismaCategoryMapper } from "../mappers";

@Injectable()
export class CategoryRepository implements ICategoryRepository {
    private readonly logger = new Logger(CategoryRepository.name);
    
    constructor(private readonly prisma: PrismaService) {}

    async save(category: CategoryEntity): Promise<void> {
        const data = PrismaCategoryMapper.toPrisma(category);

        await this.prisma.category.upsert({
            where: { id: category.id },
            create: data as any,
            update: data as any,
        });

        this.logger.log(`Category saved: ${category.id}`);
    }

    async findById(id: string): Promise<CategoryEntity | null> {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        });

        return category ? PrismaCategoryMapper.toDomain(category) : null;
    }

    async findBySlug(slug: string): Promise<CategoryEntity | null> {
        const category = await this.prisma.category.findUnique({
            where: {
                slug,
                deletedAt: null,
            },
        });

        return category ? PrismaCategoryMapper.toDomain(category) : null;
    }

    async findAll(): Promise<CategoryEntity[]> {
        const categories = await this.prisma.category.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                name: 'asc',
            },
        });

        return PrismaCategoryMapper.toDomainList(categories);
    }

    async existsByName(name: string): Promise<boolean> {
        const count = await this.prisma.category.count({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
                deletedAt: null,
            },
        });

        return count > 0;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });

        this.logger.log(`Category soft deleted: ${id}`);
    }
}