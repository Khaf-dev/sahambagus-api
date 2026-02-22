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
  CreateTagUseCase,
  ListTagsUseCase,
  GetPopularTagsUseCase,
  DeleteTagUseCase,
} from '../../application';
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
  async create(@Body() dto: CreateTagRequestDto) {
    const result = await this.createTagUseCase.execute(dto);
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/tags
   * List all tags (alphabetically)
   */
  @Get()
  async list() {
    const result = await this.listTagsUseCase.execute();
    return ApiResponse.success(result);
  }

  /**
   * GET /api/v1/tags/popular
   * Get popular tags by usage count
   */
  @Get('popular')
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
  async delete(@Param('id') id: string) {
    await this.deleteTagUseCase.execute(id);
  }
}