import { UserEntity } from "../entities";

export interface IUserRepository {
    save(user: UserEntity): Promise<void>;
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
    existsByEmail(email: string): Promise<boolean>;
    delete(id: string): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');