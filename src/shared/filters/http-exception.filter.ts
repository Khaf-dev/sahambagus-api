import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../response/api-response';

/**
 * Global HTTP Exception Filter
 * 
 * Catches all exceptions and formats them
 * into standard ApiResponse error format.
 * 
 * Penting: Never expose stack traces in response
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = 'INTERNAL_SERVER_ERROR';
        let errorMessage = 'An unexpected error occured';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                errorMessage = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse as any;
                errorMessage = Array.isArray(resp.message) 
                    ? resp.message.join(', ') 
                    : resp.message || errorMessage;
            }

            errorCode = this.getErrorCode(status);
        }

        // Log error (with stack trace for debugging not exposed to client)
        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${errorMessage}`,
            exception instanceof Error ? exception.stack : String(exception),
        );
    }

    private getErrorCode(status: number): string {
        const codes: Record<number, string> = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            409: 'CONFLICT',
            422: 'UNPROCESSABLE_ENTITY',
            429: 'TOO_MANY_REQUESTS',
            500: 'INTERNAL_SERVER_ERROR',
        };
        return codes[status] || 'UNKNOWN_ERROR';
    }
}

