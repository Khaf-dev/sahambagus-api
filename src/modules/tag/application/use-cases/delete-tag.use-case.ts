import { Injectable, Inject } from '@nestjs/common';
import {
  ITagRepository,
  TagNotFoundException,
} from '../../domain';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    @Inject(ITagRepository)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(tagId: string): Promise<void> {
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new TagNotFoundException(tagId);
    }

    await this.tagRepository.delete(tagId);
  }
}