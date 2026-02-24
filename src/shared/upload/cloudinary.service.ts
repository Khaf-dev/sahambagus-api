import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);

    constructor(private configService: ConfigService) {
        // Configurasi cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('cloudinary.cloudName'),
            api_key: this.configService.get<string>('cloudinary.apiKey'),
            api_secret: this.configService.get<string>('cloudinary.apiSecret'),
        });

        this.logger.log('Cloudinary configured');
    }

    /**
     * Upload image to CLoudinary
     * 
     * @param file - Multer file
     * @param folder - Cloudinary folder (e.g., 'news', 'analysis')
     * @returns Upload result with URL
     */
    async uploadImage(
        file: Express.Multer.File,
        folder: string = 'sahambagus',
    ): Promise<UploadApiResponse> {
      return new Promise((resolve, reject) => {
        // Create upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 630, crop: 'limit' }, // Max size
                    { quality: 'auto' }, // Auto quality
                    { fetch_format: 'auto' }, // Auto format (WebP when supported)
                ],
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    this.logger.error(`Upload failed: ${error.message}`);
                    return reject(new BadRequestException('Image upload failed'));
                }

                this.logger.log(`Image uploaded: ${result?.public_id}`);
                resolve(result!);
            },
        );

        // Pipe file buffer to upload stream
        uploadStream.end(file.buffer);
      });
    }

    /**
     * Delete image from Cloudinary
     * 
     * @param publicId - Cloudinary public ID
     */
     async deleteImage(publicId: string): Promise<void> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
      
            if (result.result === 'ok') {
                this.logger.log(`Image deleted: ${publicId}`);
            } else {
                this.logger.warn(`Image deletion failed: ${publicId}`);
            }
        } catch (error) {
            this.logger.error(`Error deleting image: ${error.message}`);
            throw new BadRequestException('Failed to delete image');
        }
     }

    /**
     * Extract public ID from Cloudinary URL
     * 
     * @param url - Cloudinary URL
     * @returns Public ID
     */
     extractPublicId(url: string): string | null {
        try {
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{folder}/{public_id}.{format}
            const matches = url.match(/\/([^\/]+)\.[a-z]+$/);
            if (matches && matches[1]) {
                // Also extract folder if exists
                const folderMatches = url.match(/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/);
                return folderMatches ? folderMatches[1] : matches[1];
            }
            return null;
        } catch (error) {
            this.logger.error(`Failed to extract public ID: ${error.message}`);
            return null;
        }
    }
}