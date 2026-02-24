import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '../../domain';

export class PrismaUserMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    return UserEntity.reconstitute({
        id: prismaUser.id,
        email: prismaUser.email,
        password: prismaUser.password,
        firstName: prismaUser.firstName,
        lastName: prismaUser.lastName,
        role: prismaUser.role,
        isActive: prismaUser.isActive,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
        lastLogin: prismaUser.lastLogin,
    });
  }

  static toPrisma(user: UserEntity) {
    return {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.toString() as any,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
    };
  }

  static toDomainList(prismaUsers: PrismaUser[]): UserEntity[] {
    return prismaUsers.map((user) => this.toDomain(user));
  }
}