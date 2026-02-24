import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Public } from "../auth/infrastructure/decorators";
import {
    HealthCheck,
    HealthCheckService,
    PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from "src/shared/database";
import { RedisService } from "src/shared/cache";

/**
 * Health check controller
 * 
 * Provides two endpoints:
 * - /health/live : Liveness check (is app running?)
 * - /health/ready : Readiness check (is app ready for traffic?)
 */

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private prismaHealth: PrismaHealthIndicator,
        private prisma: PrismaService,
        private redis: RedisService,
    ) {}

    @Get('live')
    @Public()
    @ApiOperation({ summary: 'Liveness probe' })
    async liveness() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }

    @Get('ready')
    @Public()
    @HealthCheck()
    @ApiOperation({ summary: 'Readiness probe' })
    async readiness() {
        return this.health.check([
            () => this.prismaHealth.pingCheck('database', this.prisma),
            async () => {
                const isHealthy = await this.redis.ping();
                return {
                    redis: {
                        status: isHealthy ? 'up' : 'down',
                    },
                };
            },
        ]);
    }
}