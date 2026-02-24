import { Injectable, Inject } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as bcrypt from 'bcrypt';
import {
    IUserRepository,
    UserEntity,
    UserAlreadyExistsException,
    UserRole,
} from '../../domain';
import { CreateUserDto, UserResponseDto } from "../dtos";
import { UserMapper } from "../mappers";


@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user exists
    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) {
        throw new UserAlreadyExistsException(dto.email);
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // create role
    const role = dto.role ? UserRole.fromString(dto.role) : UserRole.AUTHOR;

    // create user entity
    const user = UserEntity.create({
        id: randomUUID(),
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role,
    });

    // Save user
    await this.userRepository.save(user);

    // Return dto
    return UserMapper.toDto(user);
  }
}