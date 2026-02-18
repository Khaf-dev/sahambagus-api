import { Module, Global } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { RedisService } from "./redis.service";

/**
 * REdis module
 * 
 * Global module for Redis caching service.
 * Import once in AppModule, available everywhere.
 */
@Global()
@Module({
    imports: [ConfigModule],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}