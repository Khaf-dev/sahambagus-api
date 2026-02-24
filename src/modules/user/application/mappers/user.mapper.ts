import { UserEntity } from "../../domain";
import { UserResponseDto } from "../dtos";

export class UserMapper {
    static toDto(entity: UserEntity): UserResponseDto {
      return {
        id: entity.id,
        email: entity.email,
        firstName: entity.firstName,
        lastName: entity.lastName,
        fullName: entity.fullName,
        role: entity.role.toString(),
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        lastLogin: entity.lastLogin,
      };
    }

    static toListDto(entities: UserEntity[]): UserResponseDto[] {
        return entities.map((entity) => this.toDto(entity));
    }
}