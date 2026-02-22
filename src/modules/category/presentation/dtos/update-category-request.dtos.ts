import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateCategoryRequestDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be valid hex format (e.g., #2e6c6f)',
  })
  color?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;
}