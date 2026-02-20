import { NewsEntity } from "../entities";

/**
 * News Repositori Interface
 * 
 * Contract for persistance operations.
 * Implementation will be in infrastructure layer
 * 
 * Penting: works with domain entities, not database models.
 */
export interface INewsRepository {

    save(news: NewsEntity): Promise<void>;
    findById(id: string): Promise<NewsEntity> | null;
    findBySlug(slug: string): Promise<NewsEntity> | null;
    findMany(options: FindManyOptions): Promise<NewsEntity[]>;
    count(options: CountOptions): Promise<number>;
    existsBySlug(slug: string): Promise<boolean>;
    delete(id: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
}

/**
 * Options for findMany query
 */
export interface FindManyOptions {
    // Pagination
    page?: number;
    limit?: number;

    // Filters
    status?: string;
    authorId?: string;
    searchTerm?: string;

    isFeatured?: boolean;
    dateFrom?: string;
    dateTo?: string;

    // Sorting
    sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'title';
    sortOrder?: 'asc' | 'desc';

    // Include deleted
    includeDeleted?: boolean;
}

/**
 * Options for count query
 */
export interface CountOptions {
    status?: string;
    authorId?: string;
    isFeatured?: boolean;
    includeDeleted?: boolean;
}

/**
 * Injection token for dependency injection
 */
export const INewsRepository = Symbol('INewsRepository');
