import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}