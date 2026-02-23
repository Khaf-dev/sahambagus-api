import {
  IsString,
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

export class UpdateAnalysisRequestDto {
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  subtitle?: string;

  @IsString()
  @IsOptional()
  @MinLength(50)
  content?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  stockTicker?: string;

  @IsString()
  @IsOptional()
  @IsIn(['TECHNICAL', 'FUNDAMENTAL', 'SENTIMENT', 'MARKET_UPDATE'])
  analysisType?: string;

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
}