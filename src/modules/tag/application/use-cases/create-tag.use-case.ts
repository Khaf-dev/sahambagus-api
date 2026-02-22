import { Injectable, Inject } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
    TagEntity,
    ITagRepository,
    TagAlreadyExistsException,
} from '../../domain';
import { Slug } from "src/modules/news/domain/value-objects/slug.vo";
import { CreateTagDto, TagResponseDto } from "../dtos";
import { TagMapper } from "../mappers";

@Injectable()
export class CreateTagUseCase {
    constructor(
        @Inject(ITagRepository)
        private readonly tagRepository: ITagRepository,
    ) {}

    async execute(dto: CreateTagDto): Promise<TagResponseDto> {
    // 1. Check if tag already exists
    const exists = await this.tagRepository.existsByName(dto.name);
    if (exists) {
      throw new TagAlreadyExistsException(dto.name);
    }

    // 2. Generate slug from name
    const slug = Slug.fromTitle(dto.name);

    // 3. Create entity
    const tag = TagEntity.create({
      id: randomUUID(),
      slug,
      name: dto.name,
    });

    // 4. Save
    await this.tagRepository.save(tag);

    // 5. Return DTO
    return TagMapper.toDto(tag);
  }
}