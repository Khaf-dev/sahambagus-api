import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse as ApiResponseSwagger,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import {
  CreateAnalysisUseCase,
  UpdateAnalysisUseCase,
  GetAnalysisBySlugUseCase,
  ListAnalysisUseCase,
  PublishAnalysisUseCase,
  SubmitForReviewUseCase,
  DeleteAnalysisUseCase,
  GetFeaturedAnalysisUseCase,
  ToggleFeaturedAnalysisUseCase,
  GetLatestAnalysisByStockUseCase,
} from '../../application';
import {
  CreateAnalysisRequestDto,
  UpdateAnalysisRequestDto,
  ListAnalysisQueryDto,
} from '../dtos';
import { Public } from 'src/modules/auth/infrastructure/decorators';
import { ApiResponse } from '../../../../shared/response/api-response';

@ApiTags('Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(
    private readonly createAnalysisUseCase: CreateAnalysisUseCase,
    private readonly updateAnalysisUseCase: UpdateAnalysisUseCase,
    private readonly getAnalysisBySlugUseCase: GetAnalysisBySlugUseCase,
    private readonly listAnalysisUseCase: ListAnalysisUseCase,
    private readonly publishAnalysisUseCase: PublishAnalysisUseCase,
    private readonly submitForReviewUseCase: SubmitForReviewUseCase,
    private readonly deleteAnalysisUseCase: DeleteAnalysisUseCase,
    private readonly getFeaturedAnalysisUseCase: GetFeaturedAnalysisUseCase,
    private readonly toggleFeaturedAnalysisUseCase: ToggleFeaturedAnalysisUseCase,
    private readonly getLatestAnalysisByStockUseCase: GetLatestAnalysisByStockUseCase,
  ) {}

  /**
   * POST /api/v1/analysis
   * Create new analysis
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create stock analysis',
    description: 'Create a new stock analysis in DRAFT status with ticker, type, and optional target price'
  })
  @ApiResponseSwagger({ status: 201, description: 'Analysis created successfully' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreateAnalysisRequestDto) {
    const result = await this.createAnalysisUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/analysis
   * List analysis with pagination and filters
   */
  @Get()
  @Public()
  @ApiOperation({ 
    summary: 'List stock analysis',
    description: 'Get paginated list of stock analysis with advanced filters (ticker, type, category, tags)'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10, max: 100)' })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] })
  @ApiQuery({ name: 'stockTicker', required: false, type: String, description: 'Filter by single stock ticker (e.g., BBRI)' })
  @ApiQuery({ name: 'stockTickers', required: false, type: String, description: 'Filter by multiple tickers comma-separated (e.g., BBRI,BBCA,TLKM)' })
  @ApiQuery({ name: 'analysisType', required: false, type: String })
  @ApiQuery({ name: 'tagId', required: false, type: String })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiResponseSwagger({ status: 200, description: 'Analysis list retrieved successfully' })
  async list(@Query() query: ListAnalysisQueryDto) {
    const result = await this.listAnalysisUseCase.execute(query);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/analysis/featured
   * Get featured analysis (for homepage)
   * Penting : Must be sebelum /:slug rute
   */
  @Get('featured')
  @Public()
  @ApiOperation({
    summary: 'Get featured analysis',
    description: 'Get featured published stock analysis (limit 5) - for homepage hero section'
  })
  @ApiResponseSwagger({ status: 200, description: 'Featured analysis retrieved successfully' })
  async getFeatured() {
    const result = await this.getFeaturedAnalysisUseCase.execute(5);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/analysis/:id/feature
   * Mark analysis as featured
   */
  @Post(':id/feature')
  @ApiOperation({
    summary: 'Mark analysis as featured',
    description: 'Mark a published analysis as featured. Only PUBLISHED analysis can be featured'
  })
  @ApiParam({ name: 'id', description: 'Analysis UUID' })
  @ApiResponseSwagger({ status: 201, description: 'Analysis marked as featured' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  @ApiResponseSwagger({ status: 400, description: 'Analysis must be published to be featured' })
  async feature(@Param('id') id: string) {
    const result = await this.toggleFeaturedAnalysisUseCase.execute(id, false);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/analysis/:id/unfeature
   * Unmark analysis as featured
   */
  @Post(':id/unfeature')
  @ApiOperation({
    summary: 'Unmark analysis as featured',
    description: 'Remove featured status from analysis'
  })
  @ApiParam({ name: 'id', description: 'Analysis UUID' })
  @ApiResponseSwagger({ status: 201, description: 'Analysis unmarked as featured' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  async unfeature(@Param('id') id: string) {
    const result = await this.toggleFeaturedAnalysisUseCase.execute(id, false);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/analysis/stock/:ticker
   * Get latest analysis for a specific stock
   * Contoh: /api/v1/analysis/stock/BBRI
   * Penting: Must be sebelum /:slug rute
   */

  @Get('stock/:ticker')
  @Public()
  @ApiOperation({
    summary: 'Get latest analysis by stock',
    description: 'Get the latest 5 published analysis for a specific stock ticker. Useful for stock detail pages.'
  })
  @ApiParam({ name: 'ticker', description: 'Stock ticker symbol', example: 'BBRI' })
  @ApiResponseSwagger({ status: 200, description: 'Latest analysis retrieved successfully' })
  async getByStock(@Param('ticker') ticker: string) {
    const result = await this.getLatestAnalysisByStockUseCase.execute(ticker, 5);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/analysis/:slug
   * Get single analysis by slug
   * Increments view count
   */
  @Get(':slug')
  @Public()
  @ApiOperation({
    summary: 'Get analysis by slug',
    description: 'Get single stock analysis by slug. Increment view count for published analysis'
  })
  @ApiParam({ name: 'slug', description: 'Analysis slug', example: 'analisis-teknikal-bbri-breakout-resistance' })
  @ApiResponseSwagger({ status: 200, description: 'Analysis retrieved successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.getAnalysisBySlugUseCase.execute(slug);
    return ApiResponse.success(result);
  }

  /**
   * PATCH /api/v1/analysis/:id
   * Update analysis (DRAFT only)
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update analysis',
    description: 'Update stock analysis. Only DRAFT analysis can be updated'
  })
  @ApiParam({ name: 'id', description: 'Analysis UUID' })
  @ApiResponseSwagger({ status: 200, description: 'Analysis updated successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  @ApiResponseSwagger({ status: 400, description: 'Cannot update non-draft analysis' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnalysisRequestDto,
  ) {
    const result = await this.updateAnalysisUseCase.execute(id, dto);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/analysis/:id/submit
   * Submit analysis for review
   */
  @Post(':id/submit')
  @ApiOperation({
    summary: 'Submit analysis for review',
    description: 'Submit DRAFT analysis for editorial review. Changes status from DRAFT.'
  })
  @ApiParam({ name: 'id', description: 'Analysis UUID' })
  @ApiResponseSwagger({ status: 201, description: 'Analysis submitted for review' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  @ApiResponseSwagger({ status: 400, description: 'Can only submit DRAFT analysis' })
  async submitForReview(@Param('id') id: string) {
    const result = await this.submitForReviewUseCase.execute(id);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/analysis/:id/publish
   * Publish analysis
   */
  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish analysis',
    description: 'Publish REVIEW analysis. Change status from REVIEW to PUBLISHED and sets publishedAt timestamp'
  })
  @ApiParam({ name: 'id', description: 'Analysis UUID' })
  @ApiResponseSwagger({ status: 201, description: 'Analysis published successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  @ApiResponseSwagger({ status: 400, description: 'Can only publish REVIEW analysis' })
  async publish(@Param('id') id: string) {
    const result = await this.publishAnalysisUseCase.execute(id);
    return ApiResponse.success(result);
  }

  /**
   * DELETE /api/v1/analysis/:id
   * Delete analysis (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete analysis',
    description: 'Soft delete stock analysis. Sets deletedAt timestamp'
  })
  @ApiParam({ name: 'id', description: 'Analysis UUID' })
  @ApiResponseSwagger({ status: 204, description: 'Analysis deleted successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Analysis not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteAnalysisUseCase.execute(id);
  }
}