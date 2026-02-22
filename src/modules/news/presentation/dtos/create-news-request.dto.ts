import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  MaxLength, 
  MinLength, 
  IsBoolean,
  IsUUID,
  IsArray
} from 'class-validator';

/**
 * CreateNewsRequestDto
 * 
 * HTTP request DTO with validation decorators.
 * Validated by NestJS ValidationPipe.
 */
export class CreateNewsRequestDto {
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