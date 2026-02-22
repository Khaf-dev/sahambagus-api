import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  DeleteCategoryUseCase,
} from '../../application';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../dtos';
import { ApiResponse } from '../../../../shared/response/api-response';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  /**
   * POST /api/v1/categories
   * Create new category
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryRequestDto) {
    const result = await this.createCategoryUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/categories
   * List all categories
   */
  @Get()
  async list() {
    const result = await this.listCategoriesUseCase.execute();
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/categories/:slug
   * Get category by slug
   */
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.getCategoryUseCase.execute(slug);
    return ApiResponse.success(result);
  }

  /**
   * PATCH /api/v1/categories/:id
   * Update category
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryRequestDto,
  ) {
    const result = await this.updateCategoryUseCase.execute(id, dto);
    return ApiResponse.success(result);
  }

  /**
   * DELETE /api/v1/categories/:id
   * Delete category (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.deleteCategoryUseCase.execute(id);
  }
}