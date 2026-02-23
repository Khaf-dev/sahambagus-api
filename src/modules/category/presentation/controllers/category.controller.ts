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
  ApiTags,
  ApiOperation,
  ApiResponse as ApiResponseSwagger,
  ApiParam,
} from '@nestjs/swagger';

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

@ApiTags('Categories')
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
  @ApiOperation({
    summary: 'Create category',
    description: 'Create a new content category with name, description, color, and icon'
  })
  @ApiResponseSwagger({ status: 201, description: 'Category created successfully' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid input data or duplicate name' })
  async create(@Body() dto: CreateCategoryRequestDto) {
    const result = await this.createCategoryUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/categories
   * List all categories
   */
  @Get()
  @ApiOperation({
    summary: 'List categories',
    description: 'Get all categories sorted alphabetically. Exclude soft-deleted categories'
  })
  @ApiResponseSwagger({ status: 200, description: 'Categories retrieved successfully' })
  async list() {
    const result = await this.listCategoriesUseCase.execute();
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/categories/:slug
   * Get category by slug
   */
  @Get(':slug')
  @ApiOperation({
    summary: 'Get category by slug',
    description: 'Get single category by slug'
  })
  @ApiParam({ name: 'slug', description: 'Category slug', example: 'stocks' })
  @ApiResponseSwagger({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Category not found' })
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.getCategoryUseCase.execute(slug);
    return ApiResponse.success(result);
  }

  /**
   * PATCH /api/v1/categories/:id
   * Update category
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update category',
    description: 'Update category details (name, description, color, icon)'
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponseSwagger({ status: 200, description: 'Category updated successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Category not found' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid input data' })
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
  @ApiOperation({
    summary: 'Delete category',
    description: 'Soft delete category. Sets deletedAt timestamp'
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponseSwagger({ status: 204, description: 'Category deleted successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Category not found' })
  async delete(@Param('id') id: string) {
    await this.deleteCategoryUseCase.execute(id);
  }
}