import { Slug } from '../../../news/domain/value-objects/slug.vo';

/**
 * Tag entity
 * 
 * Simple entity for content tagging
 * Tags have many-to-many relationship with News through NewsTag
 */
export class TagEntity {
    private constructor(
        public readonly id: string,
        public readonly slug: Slug,
        private _name: string,
        public readonly createdAt: Date,
        private _updatedAt: Date,
    ) {
        this.validate();
    }

    //=======================================
    // Factory Methods
    //=======================================
    static create(props: {
        id: string;
        slug: Slug;
        name: string;
    }): TagEntity {
      return new TagEntity(
        props.id,
        props.slug,
        props.name,
        new Date(),
        new Date(),
      );
    }

    static reconstitute(props: {
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }): TagEntity {
      return new TagEntity(
        props.id,
        Slug.create(props.slug),
        props.name,
        props.createdAt,
        props.updatedAt,
      );
    }

    //=======================================
    // Getters
    //=======================================

    get name(): string {
        return this._name;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    //=======================================
    // Business Methods
    //=======================================
    update(name: string): void {
        this._name = name;
        this._updatedAt = new Date();
        this.validate();
    }

    //=======================================
    // Validation
    //=======================================

    private validate(): void {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Tag name is required');
        }

        if (this._name.length > 50) {
            throw new Error('Tag name must be 50 characters or less')
        }
    }
}