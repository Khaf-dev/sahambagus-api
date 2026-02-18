import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "src/shared/database";
import { RedisService } from "src/shared/cache";
import { ApiResponse } from "src/shared/response/api-response";
import { timestamp } from "rxjs";

/**
 * Health check controller
 * 
 * Provides two endpoints:
 * - /health/live : Liveness check (is app running?)
 * - /health/ready : Readiness check (is app ready for traffic?)
 */
@Controller('health')
export class HealthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) {}

    /**
     * Liveness check
     * Is the application running?
     * Used by: Load balancer, Kubernetes liveness probe
     */
    @Get('live')
    liveness() {
        return ApiResponse.success({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    }

    /**
     * Readiness check
     * Is the applicatiion ready to accept traffic?
     * CChecks: Database + Redis connectivity
     * Used By: Kubernetes readiness probe
     */
    @Get('ready')
    async readiness() {
        const dbHealthy = await this.prisma.isHealthy();
        const redisHealthy = await this.redis.isReady();

        const allHealthy = dbHealthy && redisHealthy;

        return ApiResponse.success({
            status: allHealthy ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            services: {
                database: {
                    status: dbHealthy ? 'ok' : 'error',
                },
                redis: {
                    status: redisHealthy ? 'ok' : 'error',
                },
            },
        });
    }
}