import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis disconnected gracefully');
    }
  }

  private connect(): void {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const db = this.configService.get<number>('REDIS_DB', 0);

    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      db,
      // ⚠️ Ini yang fix hanging issue
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 3000,
      maxRetriesPerRequest: 1,
      retryStrategy: (times: number) => {
        if (times > 3) {
          this.logger.error('Redis max retries reached, giving up');
          return null; // Stop retrying
        }
        return Math.min(times * 500, 2000);
      },
    });

    this.client.on('connect', () => {
      this.logger.log(`✅ Redis connected to ${host}:${port}`);
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      this.logger.log('✅ Redis client ready');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis error:', error.message);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
      this.isConnected = false;
    });

    // Connect dengan timeout - tidak blocking startup
    this.client.connect()
      .then(() => {
        this.logger.log('✅ Redis connect() resolved');
      })
      .catch((error) => {
        this.logger.error('Redis connect() failed:', error.message);
      });
  }

  
  isReady(): boolean {
    return this.isConnected && this.client?.status === 'ready';
  }
  
  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      this.logger.error(`Redis ping failed: ${error.message}`);
      return false;
    }
  }
  
  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Redis GET JSON error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      this.logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async setJson(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      return await this.set(key, JSON.stringify(value), ttl);
    } catch (error) {
      this.logger.error(`Redis SET JSON error for key ${key}:`, error);
      return false;
    }
  }

  async delete(...keys: string[]): Promise<number> {
    try {
      return await this.client.del(...keys);
    } catch (error) {
      this.logger.error(`Redis DELETE error:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Redis EXPIRE error for key ${key}:`, error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Redis TTL error for key ${key}:`, error);
      return -2;
    }
  }

  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;
      return await this.client.del(...keys);
    } catch (error) {
      this.logger.error(`Redis DELETE PATTERN error:`, error);
      return 0;
    }
  }

  async increment(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Redis INCR error for key ${key}:`, error);
      return 0;
    }
  }

  async flushDb(): Promise<boolean> {
    try {
      const env = this.configService.get<string>('NODE_ENV');
      if (env === 'production') {
        this.logger.error('FLUSHDB is not allowed in production');
        return false;
      }
      await this.client.flushdb();
      this.logger.warn('Redis database flushed');
      return true;
    } catch (error) {
      this.logger.error('Redis FLUSHDB error:', error);
      return false;
    }
  }

  getClient(): Redis {
    return this.client;
  }
}