import { Module } from '@nestjs/common';
import {
  CreateTagUseCase,
  ListTagsUseCase,
  GetPopularTagsUseCase,
  DeleteTagUseCase,
} from './application';
import { TagRepository } from './infrastructure';
import { TagController } from './presentation/controllers';
import { ITagRepository } from './domain';

@Module({
  controllers: [TagController],
  providers: [
    {
      provide: ITagRepository,
      useClass: TagRepository,
    },
    CreateTagUseCase,
    ListTagsUseCase,
    GetPopularTagsUseCase,
    DeleteTagUseCase,
  ],
  exports: [
    ITagRepository,
    CreateTagUseCase,
    ListTagsUseCase,
    GetPopularTagsUseCase,
    DeleteTagUseCase,
  ],
})
export class TagModule {}