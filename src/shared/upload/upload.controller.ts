import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiConsumes, 
  ApiResponse as ApiResponseSwagger,
  ApiBody  // ← ADD THIS
} from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { ApiResponse } from '../response/api-response';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @ApiOperation({ 
    summary: 'Upload image', 
    description: 'Upload image to Cloudinary. Supports JPG, PNG, WebP. Max 10MB.' 
  })
  @ApiConsumes('multipart/form-data')
  // ← ADD THIS
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponseSwagger({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponseSwagger({ status: 400, description: 'Invalid file type or size' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Upload to Cloudinary
    const result = await this.cloudinaryService.uploadImage(file, 'sahambagus');

    return ApiResponse.success({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  }
}