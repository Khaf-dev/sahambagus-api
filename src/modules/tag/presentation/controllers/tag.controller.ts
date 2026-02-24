import {
  Controller,
  Get,
  Post,
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
} from '@nestjs/swagger'

import {
  CreateTagUseCase,
  ListTagsUseCase,
  GetPopularTagsUseCase,
  DeleteTagUseCase,
} from '../../application';
import { Public } from 'src/modules/auth/infrastructure/decorators';
import { CreateTagRequestDto } from '../dtos';
import { ApiResponse } from '../../../../shared/response/api-response';
import { Type } from 'class-transformer';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

class PopularTagsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly getPopularTagsUseCase: GetPopularTagsUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
  ) {}

  /**
   * POST /api/v1/tags
   * Create new tag
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create tag',
    description: 'Manually create a new tag. Tags are also auto-created when creating news/analysis'
  })
  @ApiResponseSwagger({ status: 201, description: 'Tag created successfully' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid input data or duplicate' })
  async create(@Body() dto: CreateTagRequestDto) {
    const result = await this.createTagUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/tags
   * List all tags (alphabetically)
   */
  @Get()
  @Public()
  @ApiOperation({
    summary: 'List all tags',
    description: 'Get all sorted alphabetically by name'
  })
  @ApiResponseSwagger({ status: 200, description: 'Tags retrieved successfully' })
  async list() {
    const result = await this.listTagsUseCase.execute();
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/tags/popular
   * Get popular tags by usage count
   */
  @Get('popular')
  @Public()
  @ApiOperation({
    summary: 'Get popular tags',
    description: 'Get most used tags with usage count across news and analysis. Useful for trending topics'
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max tags to return (default: 10, max: 50) '})
  @ApiResponseSwagger({ status: 200, description: 'Popular tags retrieved successfully' })
  async getPopular(@Query() query: PopularTagsQueryDto) {
    const result = await this.getPopularTagsUseCase.execute(query.limit);
    return ApiResponse.success(result);
  }

  /**
   * DELETE /api/v1/tags/:id
   * Delete tag (hard delete + remove all associations)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete tag',
    description: 'Hard delete tag and remove all associations with news/analysis'
  })
  @ApiParam({ name: 'id', description: 'Tag UUID' })
  @ApiResponseSwagger({ status: 204, description: 'Tag deleted successfully' })
  @ApiResponseSwagger({ status: 404, description: 'Tag not found' })
  async delete(@Param('id') id: string) {
    await this.deleteTagUseCase.execute(id);
  }
}