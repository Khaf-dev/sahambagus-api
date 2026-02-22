import { TagEntity } from "../../domain";
import { TagResponseDto } from "../dtos";

export class TagMapper {
    /**
     * Entity -> Response DTO
     */
    static toDto(tag: TagEntity): TagResponseDto {
        return {
            id: tag.id,
            slug: tag.slug.toString(),
            name: tag.name,
            createdAt: tag.createdAt.toISOString(),
            updatedAt: tag.updatedAt.toISOString(),
        };
    }

    /**
     * Array of entities -> Array of DTOs
     */
    static toListDto(tags: TagEntity[]): TagResponseDto[] {
        return tags.map((tag) => this.toDto(tag));
    }
}