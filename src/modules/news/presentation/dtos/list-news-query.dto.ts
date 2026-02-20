import { 
  IsOptional, 
  IsString, 
  IsInt, 
  Min, 
  Max, 
  IsIn, 
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ListNewsQueryDto
 * 
 * Query parameters for listing news.
 */
export class ListNewsQueryDto {
  // Pagination
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // Filters
  @IsOptional()
  @IsString()
  @IsIn(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
  status?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'publishedAt', 'updatedAt', 'viewCount', 'title'])
  sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'title';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}