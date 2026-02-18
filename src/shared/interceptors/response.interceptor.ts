import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../response/api-response';

/**
 * REsponse interceptor
 * 
 * Automatically wraps all successful responses
 * into standard ApiResponse format.
 */
@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const request = context.switchToHttp().getRequest<Request>();

        return next.handle().pipe(
            map((data) => {
                // If ApiResponse sudah siap, return as is
                if (data instanceof ApiResponse) {
                    return data;
                }

                // Wrap in ApiResponse
                return ApiResponse.success(data, {
                    path: request.url,
                });
            }),
        );
    }
}