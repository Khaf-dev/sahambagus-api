import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string[]>('cors.origin');
  const nodeEnv = configService.get<string>('app.env', 'development');
  
  // Global API Prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTION'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global exception filter (must be first)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  )

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);

  logger.log(`Application running on http://localhost:${port}`);
  logger.log(`API Prefix: /${apiPrefix}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap().catch(err => {
  console.error('BOOTSTRAP ERROR:', err.message);
  process.exit(1);
});