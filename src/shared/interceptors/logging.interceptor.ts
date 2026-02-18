import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

/**
 * Logging interceptor
 * 
 * Logs all incoming requests and outgoing responses
 * with timing information for performance monitoring.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const { method, url } = request;
        const start = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - start;
                    const status = context.switchToHttp().getResponse().statusCode;

                    // Log with duration for perfomance monitoring
                    this.logger.log(
                        `${method} ${url} ${status} - ${duration}ms`,
                    );

                    // warn if response is slow (>200ms target)
                    if (duration > 200) {
                        this.logger.warn(
                            `Slow repsonse: ${method} ${url} took ${duration}ms (target: <200ms)`,
                        );
                    }
                },
                error: (error) => {
                    const duration = Date.now() - start;
                    this.logger.error(
                        `${method} ${url} ERROR - ${duration}ms - ${error.message}`,
                    );
                },
            }),
        );
    }
}