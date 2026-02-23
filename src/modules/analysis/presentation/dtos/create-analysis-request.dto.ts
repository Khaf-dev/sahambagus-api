import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  IsNumber,
  IsIn,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class CreateAnalysisRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Title must be at least 10 characters' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50, { message: 'Content must be at least 50 characters' })
  content: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  // Analysis-specific fields
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  stockTicker: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['TECHNICAL', 'FUNDAMENTAL', 'SENTIMENT', 'MARKET_UPDATE'])
  analysisType: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  targetPrice?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  featuredImageUrl?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  featuredImageAlt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  metaTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  metaDescription?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  metaKeywords?: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}