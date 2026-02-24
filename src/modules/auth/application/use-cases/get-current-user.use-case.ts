import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, UserNotFoundException } from '../../../user/domain';
import { UserMapper, UserResponseDto } from '../../../user/application';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return UserMapper.toDto(user);
  }
}