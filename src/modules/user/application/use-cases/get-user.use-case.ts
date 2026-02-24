import { Injectable, Inject } from "@nestjs/common";
import { IUserRepository, UserNotFoundException } from "../../domain";
import { UserResponseDto } from "../dtos";
import { UserMapper } from "../mappers";

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);

    if (!user) {
        throw new UserNotFoundException(id);
    }

    return UserMapper.toDto(user);
  }
}