import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Database module
 * 
 * Global module for database access.
 * Import once in AppModule, available everywhere
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class DatabaseModule {}