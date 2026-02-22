import { Injectable, Inject } from '@nestjs/common';
import { ITagRepository } from '../../domain';
import { TagResponseDto } from '../dtos';
import { TagMapper } from '../mappers';

@Injectable()
export class ListTagsUseCase {
  constructor(
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.findAll();
    return TagMapper.toListDto(tags);
  }
}