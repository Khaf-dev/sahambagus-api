import { Module } from "@nestjs/common";
import { CreateUserUseCase, GetUserUseCase } from "./application";
import { UserRepository } from "./infrastructure";
import { IUserRepository } from "./domain";

@Module({
    providers: [
        CreateUserUseCase,
        GetUserUseCase,
        {
            provide: IUserRepository,
            useClass: UserRepository,
        },
    ],
    exports: [CreateUserUseCase, GetUserUseCase, IUserRepository],
})
export class UserModule {}