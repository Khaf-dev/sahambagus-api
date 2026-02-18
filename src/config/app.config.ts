export default () => ({
    app: {
        name: process.env.APP_NAME || 'SahamBagus API',
        env: process.env.NODE_ENV || 'development',
        port: parseInt(process.env.PORT, 10) || 3000,
        apiPrefix: process.env.API_PREFIX || 'api/v1',
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10)  || 6379,
        password: process.env.REDIS_PASSWORD || 'undefined',
        db: parseInt(process.env.REDIS_DB, 10) || 0,
        apiPrefix: process.env.API_PREFIX || 'api/v1',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    throttle: {
        ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
        limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
    },
    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:3000',
        ],
    },
    upload: {
        maxSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5242880,
        allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
            'image/jpeg',
            'image/png',
            'image/webp',
        ],
    },
});