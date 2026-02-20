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
  CreateNewsUseCase,
  UpdateNewsUseCase,
  GetNewsBySlugUseCase,
  ListNewsUseCase,
  PublishNewsUseCase,
  SubmitForReviewUseCase,
  DeleteNewsUseCase,
  GetFeaturedNewsUseCase,
  ToggleFeaturedUseCase,
} from '../../application';
import {
  CreateNewsRequestDto,
  UpdateNewsRequestDto,
  ListNewsQueryDto,
} from '../dtos';
import { ApiResponse } from '../../../../shared/response/api-response';

@Controller('news')
export class NewsController {
  constructor(
    private readonly createNewsUseCase: CreateNewsUseCase,
    private readonly updateNewsUseCase: UpdateNewsUseCase,
    private readonly getNewsBySlugUseCase: GetNewsBySlugUseCase,
    private readonly listNewsUseCase: ListNewsUseCase,
    private readonly publishNewsUseCase: PublishNewsUseCase,
    private readonly submitForReviewUseCase: SubmitForReviewUseCase,
    private readonly deleteNewsUseCase: DeleteNewsUseCase,
    private readonly getFeaturedNewsUseCase: GetFeaturedNewsUseCase,
    private readonly toggleFeaturedUseCase: ToggleFeaturedUseCase,
  ) {}

  /**
   * POST /api/v1/news
   * Create new news (status: DRAFT)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNewsRequestDto) {
    const result = await this.createNewsUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/news
   * List news with pagination and filters
   */
  @Get()
  async list(@Query() query: ListNewsQueryDto) {
    const result = await this.listNewsUseCase.execute(query);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/news/featured
   * Gete featured news (for homepage)
   */
  @Get('featured')
  async getFeatured() {
    const result = await this.getFeaturedNewsUseCase.execute(5);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/news/:id/feature
   * Mark news as featured
   */
  @Post(':id/feature')
  async feature(@Param('id') id: string) {
    const result = await this.toggleFeaturedUseCase.execute(id, true);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/news/:id/unfeatured
   * 
   * Unmark news as feature
   */
  @Post(':id/unfeature')
  async unfeature(@Param('id') id: string) {
    const result = await this.toggleFeaturedUseCase.execute(id, false);
    return ApiResponse.success(result);
  }
  
  /**
   * GET /api/v1/news/:slug
   * Get single news by slug
   * Increments view count
   */
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.getNewsBySlugUseCase.execute(slug);
    return ApiResponse.success(result);
  }

  /**
   * PATCH /api/v1/news/:id
   * Update news (only DRAFT status)
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateNewsRequestDto,
  ) {
    const result = await this.updateNewsUseCase.execute(id, dto);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/news/:id/submit
   * Submit for review (DRAFT → REVIEW)
   */
  @Post(':id/submit')
  async submitForReview(@Param('id') id: string) {
    const result = await this.submitForReviewUseCase.execute(id);
    return ApiResponse.success(result);
  }

  /**
   * POST /api/v1/news/:id/publish
   * Publish news (REVIEW → PUBLISHED)
   * TODO: Add authentication - only ADMIN/EDITOR
   */
  @Post(':id/publish')
  async publish(
    @Param('id') id: string,
    // TODO: @CurrentUser() user: User
  ) {
    // TODO: Get editorId from authenticated user
    const editorId = 'temp-editor-id'; // Placeholder
    
    const result = await this.publishNewsUseCase.execute(id, editorId);
    return ApiResponse.success(result);
  }


  /**
   * DELETE /api/v1/news/:id
   * Soft delete news
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteNewsUseCase.execute(id);
  }
}