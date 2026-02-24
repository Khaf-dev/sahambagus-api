import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { DatabaseModule } from "src/shared/database";
import { RedisModule } from "src/shared/cache";

/**
 * Health module
 * 
 * Provides health check endpoints for monitoring
 */
@Module({
    imports: [
        TerminusModule,
        DatabaseModule,
        RedisModule,
    ],
    controllers: [HealthController],
})
export class HealthModule {}