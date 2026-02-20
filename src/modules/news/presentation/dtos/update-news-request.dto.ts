import { 
  IsString, 
  IsOptional, 
  MaxLength, 
  MinLength, 
  IsBoolean
} from 'class-validator';

/**
 * UpdateNewsRequestDto
 * 
 * All fields optional for partial update.
 */
export class UpdateNewsRequestDto {
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