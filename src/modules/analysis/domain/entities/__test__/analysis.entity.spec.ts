import { AnalysisEntity } from '../analysis-entity';
import { Slug } from '../../../../news/domain/value-objects/slug.vo';
import { StockTicker } from '../../value-object/stock-ticker.vo';
import { AnalysisType } from '../../value-object/analysis-type.vo';

describe('AnalysisEntity', () => {
  describe('create', () => {
    it('should create valid analysis entity', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test Analysis'),
        title: 'Test Analysis BBRI',
        content: 'This is a test content with at least 50 characters for validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      expect(analysis.id).toBe('test-id');
      expect(analysis.title).toBe('Test Analysis BBRI');
      expect(analysis.stockTicker.toString()).toBe('BBRI');
      expect(analysis.analysisType.toString()).toBe('TECHNICAL');
      expect(analysis.status.isDraft()).toBe(true);
      expect(analysis.isFeatured).toBe(false);
      expect(analysis.targetPrice).toBeNull();
    });

    it('should create analysis with target price', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation test',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.FUNDAMENTAL,
        targetPrice: 5800,
        authorId: 'author-001',
      });

      expect(analysis.targetPrice).toBe(5800);
    });

    it('should throw error for title less than 10 characters', () => {
      expect(() =>
        AnalysisEntity.create({
          id: 'test-id',
          slug: Slug.fromTitle('Short'),
          title: 'Short',
          content: 'This is content with at least 50 characters for validation',
          stockTicker: StockTicker.create('BBRI'),
          analysisType: AnalysisType.TECHNICAL,
          authorId: 'author-001',
        }),
      ).toThrow('Title must be at least 10 characters');
    });

    it('should throw error for title longer than 500 characters', () => {
      expect(() =>
        AnalysisEntity.create({
          id: 'test-id',
          slug: Slug.fromTitle('Long title'),
          title: 'A'.repeat(501),
          content: 'This is content with at least 50 characters for validation',
          stockTicker: StockTicker.create('BBRI'),
          analysisType: AnalysisType.TECHNICAL,
          authorId: 'author-001',
        }),
      ).toThrow('Title must be 500 characters or less');
    });

    it('should throw error for content less than 50 characters', () => {
      expect(() =>
        AnalysisEntity.create({
          id: 'test-id',
          slug: Slug.fromTitle('Test Analysis'),
          title: 'Test Analysis',
          content: 'Short',
          stockTicker: StockTicker.create('BBRI'),
          analysisType: AnalysisType.TECHNICAL,
          authorId: 'author-001',
        }),
      ).toThrow('Content must be at least 50 characters');
    });

    it('should throw error for negative target price', () => {
      expect(() =>
        AnalysisEntity.create({
          id: 'test-id',
          slug: Slug.fromTitle('Test'),
          title: 'Test Analysis',
          content: 'This is content with at least 50 characters for validation',
          stockTicker: StockTicker.create('BBRI'),
          analysisType: AnalysisType.TECHNICAL,
          targetPrice: -100,
          authorId: 'author-001',
        }),
      ).toThrow('Target price must be positive');
    });
  });

  describe('update', () => {
    it('should update draft analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Original Title',
        content: 'Original content with at least 50 characters for validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      analysis.update({
        title: 'Updated Title',
        targetPrice: 6000,
      });

      expect(analysis.title).toBe('Updated Title');
      expect(analysis.targetPrice).toBe(6000);
    });

    it('should throw error when updating non-draft analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      // Submit for review
      analysis.submitForReview();

      expect(() =>
        analysis.update({ title: 'New Title' }),
      ).toThrow('Can only update analysis in DRAFT status');
    });
  });

  describe('submitForReview', () => {
    it('should submit draft for review', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      analysis.submitForReview();

      expect(analysis.status.isReview()).toBe(true);
    });

    it('should throw error when submitting non-draft', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      analysis.submitForReview();

      expect(() => analysis.submitForReview()).toThrow(
        'Can only submit DRAFT analysis for review',
      );
    });
  });

  describe('publish', () => {
    it('should publish review analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      analysis.submitForReview();
      analysis.publish('editor-001');

      expect(analysis.status.isPublished()).toBe(true);
      expect(analysis.editorId).toBe('editor-001');
      expect(analysis.publishedAt).toBeInstanceOf(Date);
    });

    it('should throw error when publishing non-review analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      expect(() => analysis.publish('editor-001')).toThrow(
        'Can only publish analysis in REVIEW status',
      );
    });
  });

  describe('setFeatured', () => {
    it('should mark published analysis as featured', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      analysis.submitForReview();
      analysis.publish('editor-001');
      analysis.setFeatured(true);

      expect(analysis.isFeatured).toBe(true);
    });

    it('should throw error when featuring non-published analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      expect(() => analysis.setFeatured(true)).toThrow(
        'Only published analysis can be featured',
      );
    });

    it('should allow unfeaturing any analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        isFeatured: true,
        authorId: 'author-001',
      });

      analysis.setFeatured(false);
      expect(analysis.isFeatured).toBe(false);
    });
  });

  describe('incrementViews', () => {
    it('should increment view count for published analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      analysis.submitForReview();
      analysis.publish('editor-001');

      const initialViews = analysis.viewCount;
      analysis.incrementViews();

      expect(analysis.viewCount).toBe(initialViews + 1);
    });

    it('should not increment view count for non-published analysis', () => {
      const analysis = AnalysisEntity.create({
        id: 'test-id',
        slug: Slug.fromTitle('Test'),
        title: 'Test Analysis',
        content: 'Content with at least 50 characters for proper validation',
        stockTicker: StockTicker.create('BBRI'),
        analysisType: AnalysisType.TECHNICAL,
        authorId: 'author-001',
      });

      const initialViews = analysis.viewCount;
      analysis.incrementViews();

      expect(analysis.viewCount).toBe(initialViews);
    });
  });
});