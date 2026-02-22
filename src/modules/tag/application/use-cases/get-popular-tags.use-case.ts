import { Injectable, Inject } from '@nestjs/common';
import { ITagRepository } from '../../domain';
import { PopularTagResponseDto } from '../dtos';
import { TagMapper } from '../mappers';

@Injectable()
export class GetPopularTagsUseCase {
  constructor(
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(limit: number = 10): Promise<PopularTagResponseDto[]> {
    const popularTags = await this.tagRepository.getPopularTags(limit);
    
    return popularTags.map((item) => ({
      tag: TagMapper.toDto(item.tag),
      count: item.count,
    }));
  }
}