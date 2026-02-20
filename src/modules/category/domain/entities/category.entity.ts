import { Slug } from "src/modules/news/domain/value-objects/slug.vo";

/**
 * Category entity
 * 
 * Aggregate root for category domain
 * simple entity - no complex business rules
 */
export class CategoryEntity {
    private constructor(
        public readonly id: string,
        public readonly slug: Slug,
        private _name: string,
        private _description: string | null,
        private _color: string | null,
        private _icon: string | null,
        public readonly createdAt: Date,
        private _updatedAt: Date,
    ) {
        this.validate();
    }

    // ===============================================
    // Factory Methods
    // ===============================================

    static create(props: {
        id: string;
        slug: Slug;
        name: string;
        description?: string | null;
        color?: string | null;
        icon?: string | null;
    }): CategoryEntity {
      return new CategoryEntity(
        props.id,
        props.slug,
        props.name,
        props.description || null,
        props.color || null,
        props.icon || null,
        new Date(),
        new Date(),
      );
    }

    static reconstitute(props: {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        color: string | null;
        icon: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): CategoryEntity {
      return new CategoryEntity(
        props.id,
        Slug.create(props.slug),
        props.name,
        props.description,
        props.color,
        props.icon,
        props.createdAt,
        props.updatedAt,
      );
    }

    // ===============================================
    // Getters
    // ===============================================

    get name(): string {
        return this._name
    }

    get description(): string | null {
        return this._description
    }

    get color(): string | null {
        return this._color
    }

    get icon(): string | null {
        return this._icon
    }

    get updatedAt(): Date {
        return this._updatedAt
    }

    // ===============================================
    // Business Methods
    // ===============================================

    update(props: {
    name?: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
  }): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.description !== undefined) this._description = props.description;
    if (props.color !== undefined) this._color = props.color;
    if (props.icon !== undefined) this._icon = props.icon;

    this._updatedAt = new Date();
    this.validate();
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Category name is required');
    }

    if (this._name.length > 100) {
      throw new Error('Category name must be 100 characters or less');
    }

    if (this._description && this._description.length > 500) {
      throw new Error('Category description must be 500 characters or less');
    }

    if (this._color && !this._color.match(/^#[0-9A-Fa-f]{6}$/)) {
      throw new Error('Category color must be valid hex color (e.g., #1b4049)');
    }
  }
}