import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './shared/cache';
import { DatabaseModule } from './shared/database';
import { HealthModule } from './modules/health/health.module';
import { NewsModule } from './modules/news/news.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/infrastructure/guards';
import appConfig from './config/app.config';
import { UploadModule } from './shared/upload';
import { APP_GUARD } from '@nestjs/core';

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
    UploadModule,

    // Features
    HealthModule,
    NewsModule,
    CategoryModule,
    TagModule,
    AnalysisModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}