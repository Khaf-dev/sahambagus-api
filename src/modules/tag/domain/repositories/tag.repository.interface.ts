import { TagEntity } from "../entities";

export interface ITagRepository {
    save(tag: TagEntity): Promise<void>;
    findById(id: string): Promise<TagEntity | null>;
    findBySlug(slug: string): Promise<TagEntity | null>;
    findByIds(ids: string[]): Promise<TagEntity[]>;
    findAll(): Promise<TagEntity[]>;
    existsByName(name: string): Promise<boolean>;
    delete(id: string): Promise<void>;

    // Tag specific methods
    findOrCreateByNames(names: string[]): Promise<TagEntity[]>;
    getPopularTags(limit: number): Promise<{ tag: TagEntity; count: number }[]>;
}

export const ITagRepository = Symbol('ITagRepository');