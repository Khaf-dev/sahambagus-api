import {
    Injectable,
    OnModuleInit,
    OnModuleDestroy,
    Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; 
/**
 * Prisma service
 * 
 * Wraps PrismaClient with NestJS lifecycle  hooks.
 * Global service available throughout the application.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'stdout', level: 'error' },
                { emit: 'stdout', level: 'warn' },
            ],
        });
    }

    async onModuleInit(): Promise<void> {
        try {
            await this.$connect();
            this.logger.log('Database connected successfully');
        } catch (error) {
            this.logger.error('Database connection failed:', error.message);
            throw error;
        }
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
        this.logger.log('Database disconnected gracefully');
    }

    /**
     * Check database health
     */
    async isHealthy(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch {
            return false;
        }
    }
}