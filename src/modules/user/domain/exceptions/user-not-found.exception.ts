import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
    constructor(identifier: string) {
        super(`User not found: ${identifier}`);
    }
}