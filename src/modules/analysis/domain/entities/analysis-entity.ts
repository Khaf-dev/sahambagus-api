import { Slug } from '../../../news/domain/value-objects/slug.vo';
import { ContentStatus } from '../../../news/domain/value-objects/content-status.vo';
import { AnalysisType, StockTicker } from '../value-object';

/**
 * Analysis Entity
 * 
 * Aggregate root for Analysis domain.
 * Similar to News but with stock-specific fields.
 */
export class AnalysisEntity {
  private constructor(
    public readonly id: string,
    public readonly slug: Slug,
    private _title: string,
    private _subtitle: string | null,
    private _content: string,
    private _excerpt: string | null,
    private _status: ContentStatus,
    private _isFeatured: boolean,
    private _stockTicker: StockTicker,
    private _analysisType: AnalysisType,
    private _targetPrice: number | null,
    private _categoryId: string | null,
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

  static create(props: {
    id: string;
    slug: Slug;
    title: string;
    subtitle?: string | null;
    content: string;
    excerpt?: string | null;
    isFeatured?: boolean;
    stockTicker: StockTicker;
    analysisType: AnalysisType;
    targetPrice?: number | null;
    categoryId?: string | null;
    authorId: string;
    featuredImageUrl?: string | null;
    featuredImageAlt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  }): AnalysisEntity {
    return new AnalysisEntity(
      props.id,
      props.slug,
      props.title,
      props.subtitle || null,
      props.content,
      props.excerpt || null,
      ContentStatus.DRAFT,
      props.isFeatured || false,
      props.stockTicker,
      props.analysisType,
      props.targetPrice || null,
      props.categoryId || null,
      props.featuredImageUrl || null,
      props.featuredImageAlt || null,
      props.metaTitle || null,
      props.metaDescription || null,
      props.metaKeywords || null,
      props.authorId,
      null,
      new Date(),
      new Date(),
      null,
      null,
      0,
    );
  }

  static reconstitute(props: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    content: string;
    excerpt: string | null;
    status: string;
    isFeatured: boolean;
    stockTicker: string;
    analysisType: string;
    targetPrice: number | null;
    categoryId: string | null;
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
  }): AnalysisEntity {
    return new AnalysisEntity(
      props.id,
      Slug.create(props.slug),
      props.title,
      props.subtitle,
      props.content,
      props.excerpt,
      ContentStatus.fromString(props.status),
      props.isFeatured,
      StockTicker.create(props.stockTicker),
      AnalysisType.fromString(props.analysisType),
      props.targetPrice,
      props.categoryId,
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

  get stockTicker(): StockTicker {
    return this._stockTicker;
  }

  get analysisType(): AnalysisType {
    return this._analysisType;
  }

  get targetPrice(): number | null {
    return this._targetPrice;
  }

  get categoryId(): string | null {
    return this._categoryId;
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
  // Business Methods (Same as News)
  // ============================================

  update(props: {
    title?: string;
    subtitle?: string | null;
    content?: string;
    excerpt?: string | null;
    stockTicker?: StockTicker;
    analysisType?: AnalysisType;
    targetPrice?: number | null;
    categoryId?: string | null;
    featuredImageUrl?: string | null;
    featuredImageAlt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  }): void {
    if (!this._status.isDraft()) {
      throw new Error('Can only update analysis in DRAFT status');
    }

    if (props.title !== undefined) this._title = props.title;
    if (props.subtitle !== undefined) this._subtitle = props.subtitle;
    if (props.content !== undefined) this._content = props.content;
    if (props.excerpt !== undefined) this._excerpt = props.excerpt;
    if (props.stockTicker !== undefined) this._stockTicker = props.stockTicker;
    if (props.analysisType !== undefined) this._analysisType = props.analysisType;
    if (props.targetPrice !== undefined) this._targetPrice = props.targetPrice;
    if (props.categoryId !== undefined) this._categoryId = props.categoryId;
    if (props.featuredImageUrl !== undefined) this._featuredImageUrl = props.featuredImageUrl;
    if (props.featuredImageAlt !== undefined) this._featuredImageAlt = props.featuredImageAlt;
    if (props.metaTitle !== undefined) this._metaTitle = props.metaTitle;
    if (props.metaDescription !== undefined) this._metaDescription = props.metaDescription;
    if (props.metaKeywords !== undefined) this._metaKeywords = props.metaKeywords;

    this._updatedAt = new Date();
    this.validate();
  }

  submitForReview(): void {
    if (!this._status.isDraft()) {
      throw new Error('Can only submit DRAFT analysis for review');
    }
    this._status = ContentStatus.REVIEW;
    this._updatedAt = new Date();
  }

  publish(editorId: string): void {
    if (!this._status.isReview()) {
      throw new Error('Can only publish analysis in REVIEW status');
    }
    this._status = ContentStatus.PUBLISHED;
    this._editorId = editorId;
    this._publishedAt = new Date();
    this._updatedAt = new Date();
  }

  setFeatured(featured: boolean): void {
    if (featured && !this._status.isPublished()) {
      throw new Error('Only published analysis can be featured');
    }
    this._isFeatured = featured;
    this._updatedAt = new Date();
  }

  incrementViews(): void {
    if (!this._status.isPublished()) {
      return;
    }
    this._viewCount += 1;
  }

  // ============================================
  // Validation
  // ============================================

  private validate(): void {
    if (!this._title || this._title.trim().length < 10) {
      throw new Error('Title must be at least 10 characters');
    }

    if (this._title.length > 500) {
      throw new Error('Title must be 500 characters or less');
    }

    if (!this._content || this._content.trim().length < 50) {
      throw new Error('Content must be at least 50 characters');
    }

    if (this._targetPrice !== null && this._targetPrice < 0) {
      throw new Error('Target price must be positive');
    }
  }
}