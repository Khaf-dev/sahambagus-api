import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListAnalysisQueryDto {
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
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  tagId?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  // Analysis-specific filters
  @IsOptional()
  @IsString()
  stockTicker?: string;

  // Multi-ticker filter
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean);
    }
    if (Array.isArray(value)) {
      return value.map((t) => t.trim().toUpperCase());
    }
    return value;
  }, { toClassOnly: true })
  stockTickers?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['TECHNICAL', 'FUNDAMENTAL', 'SENTIMENT', 'MARKET_UPDATE'])
  analysisType?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  // Sorting
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'publishedAt', 'updatedAt', 'viewCount', 'title'])
  sortBy?: 'createdAt' | 'publishedAt' | 'updatedAt' | 'viewCount' | 'title';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
}