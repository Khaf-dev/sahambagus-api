import { ContentStatus, Slug } from '../value-objects';

/**
 * News Entity
 * 
 * Aggregate Root for News domain.
 * Contains all business rules and invariants.
 * 
 * IMPORTANT: This entity is framework-agnostic.
 * No Prisma, no NestJS, pure TypeScript.
 */
export class NewsEntity {
  private constructor(
    public readonly id: string,
    public readonly slug: Slug,
    private _title: string,
    private _subtitle: string | null,
    private _content: string,
    private _excerpt: string | null,
    private _status: ContentStatus,
    private _isFeatured: boolean,
    private _featuredImageUrl: string | null,
    private _featuredImageAlt: string | null,
    private _metaTitle: string | null,
    private _metaDescription: string | null,
    private _metaKeywords: string | null,
    private _authorId: string | null,
    private _editorId: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date,
    private _publishedAt: Date | null,
    private _archivedAt: Date | null,
    private _viewCount: number,
  ) {
    this.validate();
  }

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Create new News (status: DRAFT)
   */
  static create(props: {
    id: string;
    slug: Slug;
    title: string;
    subtitle?: string | null;
    content: string;
    excerpt?: string | null;
    isFeatured?: boolean;
    authorId: string;
    featuredImageUrl?: string | null;
    featuredImageAlt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  }): NewsEntity {
    return new NewsEntity(
      props.id,
      props.slug,
      props.title,
      props.subtitle || null,
      props.content,
      props.excerpt || null,
      ContentStatus.DRAFT,
      props.isFeatured || false,
      props.featuredImageUrl || null,
      props.featuredImageAlt || null,
      props.metaTitle || null,
      props.metaDescription || null,
      props.metaKeywords || null,
      props.authorId,
      null, // No editor yet
      new Date(),
      new Date(),
      null, // Not published
      null, // Not archived
      0, // Zero views
    );
  }

  /**
   * Reconstitute from database
   */
  static reconstitute(props: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    content: string;
    excerpt: string | null;
    status: string;
    isFeatured: boolean;
    featuredImageUrl: string | null;
    featuredImageAlt: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    authorId: string | null;
    editorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
    archivedAt: Date | null;
    viewCount: number;
  }): NewsEntity {
    return new NewsEntity(
      props.id,
      Slug.create(props.slug),
      props.title,
      props.subtitle,
      props.content,
      props.excerpt,
      ContentStatus.fromString(props.status),
      props.isFeatured,
      props.featuredImageUrl,
      props.featuredImageAlt,
      props.metaTitle,
      props.metaDescription,
      props.metaKeywords,
      props.authorId,
      props.editorId,
      props.createdAt,
      props.updatedAt,
      props.publishedAt,
      props.archivedAt,
      props.viewCount,
    );
  }

  // ============================================
  // Getters
  // ============================================

  get title(): string {
    return this._title;
  }

  get subtitle(): string | null {
    return this._subtitle;
  }

  get content(): string {
    return this._content;
  }

  get excerpt(): string | null {
    return this._excerpt;
  }

  get status(): ContentStatus {
    return this._status;
  }

  get isFeatured(): boolean {
    return this._isFeatured;
  }

  get featuredImageUrl(): string | null {
    return this._featuredImageUrl;
  }

  get featuredImageAlt(): string | null {
    return this._featuredImageAlt;
  }

  get metaTitle(): string | null {
    return this._metaTitle;
  }

  get metaDescription(): string | null {
    return this._metaDescription;
  }

  get metaKeywords(): string | null {
    return this._metaKeywords;
  }

  get authorId(): string | null {
    return this._authorId;
  }

  get editorId(): string | null {
    return this._editorId;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  get archivedAt(): Date | null {
    return this._archivedAt;
  }

  get viewCount(): number {
    return this._viewCount;
  }

  // ============================================
  // Business Methods
  // ============================================
  
  /**
   * Update news content (only in DRAFT status)
  */
 update(props: {
   title?: string;
    subtitle?: string | null;
    content?: string;
    excerpt?: string | null;
    featuredImageUrl?: string | null;
    featuredImageAlt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  }): void {
    // Business rule: Can only edit DRAFT content
    if (!this._status.isDraft()) {
      throw new Error('Can only edit news in DRAFT status');
    }
    
    if (props.title !== undefined) this._title = props.title;
    if (props.subtitle !== undefined) this._subtitle = props.subtitle;
    if (props.content !== undefined) this._content = props.content;
    if (props.excerpt !== undefined) this._excerpt = props.excerpt;
    if (props.featuredImageUrl !== undefined) this._featuredImageUrl = props.featuredImageUrl;
    if (props.featuredImageAlt !== undefined) this._featuredImageAlt = props.featuredImageAlt;
    if (props.metaTitle !== undefined) this._metaTitle = props.metaTitle;
    if (props.metaDescription !== undefined) this._metaDescription = props.metaDescription;
    if (props.metaKeywords !== undefined) this._metaKeywords = props.metaKeywords;
    
    this._updatedAt = new Date();
    this.validate();
  }
  
  setFeatured(featured: boolean): void {
    // Business rule: Only published news can be featured
    if (featured && !this._status.isPublished()) {
      throw new Error('Only published news can be featured');
    }
 
    this._isFeatured = featured;
    this._updatedAt = new Date();
  }

  /**
   * Submit for review (DRAFT → REVIEW)
  */
 submitForReview(): void {
   if (!this._status.isDraft()) {
     throw new Error('Can only submit DRAFT news for review');
    }
    
    this._status = ContentStatus.REVIEW;
    this._updatedAt = new Date();
  }
  
  /**
   * Publish news (REVIEW → PUBLISHED)
   */
  publish(editorId: string): void {
    if (!this._status.isReview()) {
      throw new Error('Can only publish news in REVIEW status');
    }

    this._status = ContentStatus.PUBLISHED;
    this._editorId = editorId;
    this._publishedAt = new Date();
    this._updatedAt = new Date();

    // Business rule: Slug is immutable after publish
    // (enforced by making slug readonly)
  }

  /**
   * Unpublish news (PUBLISHED → DRAFT)
   */
  unpublish(): void {
    if (!this._status.isPublished()) {
      throw new Error('Can only unpublish PUBLISHED news');
    }

    this._status = ContentStatus.DRAFT;
    this._publishedAt = null;
    this._updatedAt = new Date();
  }

  /**
   * Archive news (PUBLISHED → ARCHIVED)
   */
  archive(): void {
    if (!this._status.isPublished()) {
      throw new Error('Can only archive PUBLISHED news');
    }

    this._status = ContentStatus.ARCHIVED;
    this._archivedAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Increment view counter
   */
  incrementViews(): void {
    // Only count views for published content
    if (this._status.isPublished()) {
      this._viewCount++;
    }
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this._title || this._title.trim().length === 0) {
      throw new Error('Title is required');
    }

    if (this._title.length > 500) {
      throw new Error('Title must be 500 characters or less');
    }

    if (!this._content || this._content.trim().length === 0) {
      throw new Error('Content is required');
    }

    if (this._subtitle && this._subtitle.length > 1000) {
      throw new Error('Subtitle must be 1000 characters or less');
    }

    if (this._excerpt && this._excerpt.length > 500) {
      throw new Error('Excerpt must be 500 characters or less');
    }

    // SEO validation
    if (this._metaTitle && this._metaTitle.length > 255) {
      throw new Error('Meta title must be 255 characters or less');
    }

    if (this._metaDescription && this._metaDescription.length > 500) {
      throw new Error('Meta description must be 500 characters or less');
    }
  }

  // ============================================
  // Query Methods
  // ============================================

  isPublished(): boolean {
    return this._status.isPublished();
  }

  isDraft(): boolean {
    return this._status.isDraft();
  }

  isReview(): boolean {
    return this._status.isReview();
  }

  isArchived(): boolean {
    return this._status.isArchived();
  }
}