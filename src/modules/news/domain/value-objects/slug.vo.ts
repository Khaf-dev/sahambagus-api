/**
 * Slug Value Object
 * 
 * Represents a URL-friendly identifier.
 * Immutable and validated.
 * 
 * Rules:
 * - Lowercase only
 * - Alphanumeric + hyphens
 * - No leading/trailing hyphens
 * - Max 255 characters
 * - Must be unique (enforced at repository level)
 */
export class Slug {
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MAX_LENGTH = 255;

  private constructor(private readonly value: string) {
    this.validate();
  }

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Create slug from validated string
   */
  static create(slug: string): Slug {
    return new Slug(slug);
  }

  /**
   * Generate slug from title
   * Note: This is a simple implementation.
   * In real app, use library like 'slugify' for better Unicode support.
   */
  static fromTitle(title: string): Slug {
    const slug = title
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, '-')
      // Remove non-alphanumeric except hyphens
      .replace(/[^a-z0-9-]/g, '')
      // Replace multiple hyphens with single hyphen
      .replace(/-+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-|-$/g, '')
      // Truncate to max length
      .substring(0, Slug.MAX_LENGTH);

    return new Slug(slug);
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }

    if (this.value.length > Slug.MAX_LENGTH) {
      throw new Error(`Slug must be ${Slug.MAX_LENGTH} characters or less`);
    }

    if (!Slug.SLUG_REGEX.test(this.value)) {
      throw new Error(
        'Slug must contain only lowercase letters, numbers, and hyphens (no leading/trailing hyphens)',
      );
    }
  }

  // ============================================
  // Value Object Behavior
  // ============================================

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }

  /**
   * Check if slug is available (to be used with repository)
   */
  static isValid(slug: string): boolean {
    try {
      new Slug(slug);
      return true;
    } catch {
      return false;
    }
  }
}