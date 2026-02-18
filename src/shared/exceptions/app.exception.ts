import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Base Application Exception
 * All custom exceptions extend this class.
 */
export class AppException extends HttpException {
    constructor(
        public readonly errorCode: string,
        message: string,
        status: HttpStatus,
    ) {
        super({ errorCode, message }, status);
    }
}

export class NotFoundException extends AppException {
    constructor(resource: string) {
        super('NOT_FOUND', `${resource} not found`, HttpStatus.NOT_FOUND);
    }
}

export class ConflictException extends AppException {
    constructor(message: string) {
        super('CONFLICT', message, HttpStatus.CONFLICT);
    }
}

export class BadRequestException extends AppException {
    constructor(message: string) {
        super('BAD_REQUEST', message, HttpStatus.BAD_REQUEST);
    }
}

export class UnauthorizedException extends AppException {
    constructor(message = 'Unauthorized') {
        super('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED);
    }
}

export class ForbiddenException extends AppException {
    constructor(message = 'Forbidden') {
        super('FORBIDDEN', message, HttpStatus.FORBIDDEN);
    }
}