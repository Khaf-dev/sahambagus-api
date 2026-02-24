import { Injectable, Logger } from "@nestjs/common";
import { UserEntity, IUserRepository } from "../../domain";
import { PrismaService } from "src/shared/database";
import { PrismaUserMapper } from "../mappers";

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.upsert({
      where: { id: user.id },
      create: data as any,
      update: data as any,
    });

    this.logger.log(`User saved: ${user.id}`);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return PrismaUserMapper.toDomainList(users);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.toLowerCase() },
    });

    return count > 0;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User deleted: ${id}`);
  }
}