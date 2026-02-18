import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './shared/cache';
import { DatabaseModule } from './shared/database';
import { HealthModule } from './modules/health/health.module';
import appConfig from './config/app.config';

/**
 * Main Applicant Module
 * 
 * Root module that imports all shared modules:
 * - ConfigModule: Environment variables
 * - RedisModule: Caching service
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
      cache: true,
    }),

    //Database shared module
    DatabaseModule,
    RedisModule,

    // Features
    HealthModule,
  ],
})
export class AppModule {}