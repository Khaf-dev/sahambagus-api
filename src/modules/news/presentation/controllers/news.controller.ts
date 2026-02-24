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
import { Public } from 'src/modules/auth/infrastructure/decorators';
import { ApiResponse } from '../../../../shared/response/api-response';

@ApiTags('News')
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
  @ApiOperation({ summary: 'Create news article', description: 'Create a new news article in DRAFT status' })
  @ApiResponseSwagger({ status: 201, description: 'News created successfully' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid input data' })
  async create(@Body() dto: CreateNewsRequestDto) {
    const result = await this.createNewsUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/news
   * List news with pagination and filters
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'List news articles', description: 'Get paginated list of with filters'})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10) '})
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'] })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiResponseSwagger({ status: 200, description: 'News list retrieved successfully' })
  async list(@Query() query: ListNewsQueryDto) {
    const result = await this.listNewsUseCase.execute(query);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/news/featured
   * Gete featured news (for homepage)
   */
  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured news', description: 'Get featured published news (limit: 5)' })
  @ApiResponseSwagger({ status: 200, description: 'Featured news retrieved successfully' })
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
  @Public()
  @ApiOperation({ summary: 'Get news by slug', description: 'Get single news article by slug. Increment view count for published articles.' })
  @ApiParam({ name: 'slug', description: 'News slug', example: 'bbri-catat-laba-bersih-rp-65-triliun' })
  @ApiResponseSwagger({ status: 200, description: 'News retrieved successfully' })
  @ApiResponseSwagger({ status: 400, description: 'News not found' })
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