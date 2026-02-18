# SahamBagus - Troubleshooting Guide

**Purpose:** Solutions to common issues encountered during development  
**Last Updated:** February 18, 2026

---

## Table of Contents

1. [Setup Issues](#setup-issues)
2. [Database Issues](#database-issues)
3. [Redis Issues](#redis-issues)
4. [TypeScript Issues](#typescript-issues)
5. [Runtime Issues](#runtime-issues)
6. [Performance Issues](#performance-issues)

---

## Setup Issues

### Issue 1: Prisma Schema Not Found

**Error:**

```
Error: Could not find Prisma Schema
```

**Root Cause:** Schema file not in expected location

**Solution:**

```bash
# Ensure file exists at correct path
ls prisma/schema.prisma

# If not, create it:
mkdir prisma
# Copy schema.prisma to prisma/
```

**Prevention:** Always check file paths match project structure

---

### Issue 2: Dependencies Not Installing

**Error:**

```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Root Cause:** Conflicting package versions

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, use legacy peer deps
npm install --legacy-peer-deps
```

---

## Database Issues

### Issue 3: Database Connection Failed

**Error:**

```
P1001: Can't reach database server at localhost:5432
```

**Root Cause:** PostgreSQL not running or wrong connection string

**Solution:**

```bash
# 1. Check PostgreSQL is running
pg_isready -h localhost -p 5432

# 2. If not running, start it
# Windows: Check Services → PostgreSQL
# Linux: sudo systemctl start postgresql
# Mac: brew services start postgresql

# 3. Verify .env DATABASE_URL
cat .env | grep DATABASE_URL

# Should be:
# DATABASE_URL="postgresql://username:password@localhost:5432/sahambagus?schema=public"

# 4. Test connection
psql -U postgres -h localhost -p 5432
```

**Prevention:**

- Always verify PostgreSQL is running before starting app
- Keep credentials in `.env` correct

---

### Issue 4: UUID Function Not Found

**Error:**

```
ERROR: function uuid_generate_v4() does not exist
HINT: No function matches the given name
```

**Root Cause:** UUID extension not enabled in PostgreSQL

**Solution:**

```bash
# Connect to database
psql -U postgres -h localhost -p 5432 -d sahambagus

# Enable extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Verify
\dx

# Should see uuid-ossp in list

# Exit
\q

# Retry migration
npx prisma db push
```

**Prevention:** Always enable uuid-ossp extension in new databases

---

### Issue 5: Shadow Database Error

**Error:**

```
P3006: Migration failed to apply to shadow database
ERROR: function uuid_generate_v4() does not exist
```

**Root Cause:** Shadow database also needs UUID extension

**Solution Option 1 (Quick - Development):**

```bash
# Disable shadow database by using same URL
# In .env:
DATABASE_URL="postgresql://..."
SHADOW_DATABASE_URL="postgresql://..."  # Same as DATABASE_URL
```

**Solution Option 2 (Proper - Production):**

```bash
# Enable UUID in template1 (all new DBs inherit it)
psql -U postgres -h localhost -p 5432 -d template1

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

**Prevention:** Enable UUID in template1 database

---

### Issue 6: Tables Not Created

**Error:** Prisma Studio shows no models

**Root Cause:** Migration not executed properly

**Solution:**

```bash
# Check migration status
npx prisma migrate status

# If no migrations exist:
npx prisma db push

# Verify tables exist
psql -d sahambagus
\dt

# Should see: news, analysis, users, redirect_mappings
```

**Prevention:** Always verify schema changes apply to database

---

## Redis Issues

### Issue 7: Redis Connection Timeout (WSL)

**Error:**

```
Error: connect ETIMEDOUT
```

**Root Cause:** Redis in WSL not reachable from Windows via localhost

**Solution Option 1 (Recommended - Windows Native):**

```bash
# 1. Download Redis for Windows
# https://github.com/tporadowski/redis/releases

# 2. Extract to C:\Redis

# 3. Start redis-server
C:\Redis\redis-server.exe

# 4. Update .env
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379

# 5. Test
C:\Redis\redis-cli.exe ping
# Should return: PONG
```

**Solution Option 2 (WSL Network Fix):**

```bash
# 1. Get WSL IP
wsl hostname -I
# Example output: 172.20.xxx.xxx

# 2. Configure Redis to listen on all interfaces
wsl
sudo nano /etc/redis/redis.conf

# Find and change:
bind 127.0.0.1 -::1
# To:
bind 0.0.0.0

# Save and restart
sudo service redis-server restart

# 3. Update .env
REDIS_HOST="172.20.xxx.xxx"  # Use your WSL IP
```

**Prevention:** Use Windows native Redis for development simplicity

---

### Issue 8: Port 6379 Already in Use

**Error:**

```
Error: bind: An operation was attempted on something that is not a socket
```

**Root Cause:** Another Redis instance already running on port 6379

**Solution:**

```bash
# Find process using port 6379
netstat -ano | findstr :6379

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or stop WSL Redis if running
wsl
sudo service redis-server stop
```

**Prevention:** Only run one Redis instance at a time

---

## TypeScript Issues

### Issue 9: Module Config Conflict

**Error:**

```
error TS5023: Unknown compiler option 'moduleResolution'
```

**Root Cause:** `tsconfig.json` has incompatible module settings

**Solution:**

```bash
# Update tsconfig.json:
{
  "compilerOptions": {
    "module": "commonjs",          # Not "nodenext"
    "moduleResolution": "node",    # Not "nodenext"
    "target": "ES2021",
    // ... other settings
  }
}

# Clean and rebuild
rm -rf dist
npm run build
```

**Prevention:** Use `commonjs` module system for NestJS

---

### Issue 10: Prisma Client Type Error

**Error:**

```
error TS2305: Module '@prisma/client' has no exported member 'PrismaClient'
```

**Root Cause:** Prisma Client not generated

**Solution:**

```bash
# 1. Generate Prisma Client
npx prisma generate

# Should output:
# ✔ Generated Prisma Client to .\node_modules\.prisma\client

# 2. Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 3. Restart dev server
npm run start:dev
```

**Prevention:** Always run `npx prisma generate` after schema changes

---

### Issue 11: TypeScript Cache Out of Sync

**Error:**

```
TypeScript still shows errors even after fixing imports
```

**Root Cause:** TypeScript language server cache

**Solution:**

```bash
# In VS Code:
# 1. Press Ctrl+Shift+P
# 2. Type: "TypeScript: Restart TS Server"
# 3. Press Enter

# Or close and reopen VS Code

# Or clean build:
rm -rf dist node_modules/.cache
npm run build
```

**Prevention:** Restart TS server after major dependency changes

---

## Runtime Issues

### Issue 12: Prisma Version Mismatch

**Error:**

```
Error: The 'prisma' instance you provided does not match the 'PrismaClient' type expected by '@prisma/client'
```

**Root Cause:** Prisma CLI and @prisma/client versions don't match

**Solution:**

```bash
# Uninstall both
npm uninstall prisma @prisma/client

# Install matching versions
npm install -D prisma@6.19.2
npm install @prisma/client@6.19.2

# Generate client
npx prisma generate

# Restart dev server
npm run start:dev
```

**Prevention:** Keep prisma and @prisma/client at same version

---

### Issue 13: Prisma 7 Breaking Changes

**Error:**

```
Error: The datasource property `url` is no longer supported
```

**Root Cause:** Accidentally installed Prisma 7 which has breaking changes

**Solution:**

```bash
# Downgrade to Prisma 6
npm uninstall prisma @prisma/client
npm install -D prisma@6.19.2
npm install @prisma/client@6.19.2

# Update schema if needed (remove shadowDatabaseUrl)
# prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  # Remove: shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}

# Regenerate
npx prisma generate
```

**Prevention:** Pin versions in package.json:

```json
{
  "dependencies": {
    "@prisma/client": "6.19.2"
  },
  "devDependencies": {
    "prisma": "6.19.2"
  }
}
```

---

### Issue 14: Application Hangs at Startup

**Symptoms:**

```
Starting compilation in watch mode...
Found 0 errors. Watching for file changes.
[No further output]
```

**Root Cause:** App waiting for async operation (usually Redis connect)

**Solution:**

```bash
# 1. Check if Redis is running
redis-cli ping
# Should return: PONG

# 2. If not running, start Redis
C:\Redis\redis-server.exe

# 3. Check .env Redis config
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379

# 4. Force restart
Ctrl+C
npm run start:dev
```

**Debug Steps:**

```typescript
// Add console.log in main.ts to pinpoint hang
console.log('STEP 1: Starting bootstrap');
const app = await NestFactory.create(AppModule);
console.log('STEP 2: App created');
await app.listen(3000);
console.log('STEP 3: Listening');
// Check which STEP doesn't print
```

---

### Issue 15: Port 3000 Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Root Cause:** Previous instance still running

**Solution:**

```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

**Prevention:** Always stop previous instance before starting new one

---

## Performance Issues

### Issue 16: Slow API Responses (>200ms)

**Symptoms:** Log shows:

```
⚠️ Slow response: GET /api/v1/news took 350ms
```

**Root Cause:** N+1 query problem or missing indexes

**Solution:**

```typescript
// Bad: N+1 queries
const news = await prisma.news.findMany();
for (const item of news) {
  item.author = await prisma.user.findUnique({
    where: { id: item.authorId }
  });
}

// Good: Single query with join
const news = await prisma.news.findMany({
  include: { author: true }
});

// Add indexes in schema:
model News {
  @@index([status, publishedAt], name: "idx_news_status_published")
}

// Regenerate and push
npx prisma generate
npx prisma db push
```

---

### Issue 17: High Memory Usage

**Symptoms:** Node process using >500MB RAM

**Root Cause:** Memory leak or caching too much data

**Solution:**

```typescript
// Check Redis cache sizes
await redis.dbsize();

// Set TTL on all cached items
await redis.set(key, value, 300); // 5 minutes

// Clean old cache entries
await redis.deletePattern('news:list:*');

// Restart application periodically in production
```

---

## Development Environment Issues

### Issue 18: VS Code Not Recognizing Types

**Solution:**

```bash
# 1. Reload window
Ctrl+Shift+P → "Developer: Reload Window"

# 2. Restart TS Server
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# 3. Clear VS Code cache
# Close VS Code
# Delete .vscode folder
# Reopen VS Code
```

---

### Issue 19: Git Conflicts in package-lock.json

**Solution:**

```bash
# Delete package-lock.json
rm package-lock.json

# Reinstall
npm install

# Commit new lock file
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
```

---

## Emergency Procedures

### Complete Reset (Nuclear Option)

```bash
# Stop all services
Ctrl+C  # Stop dev server
taskkill /F /IM redis-server.exe  # Stop Redis

# Delete everything
rm -rf node_modules
rm -rf dist
rm -rf generated
rm -rf .next
rm -rf .vscode/.tsbuildinfo
rm package-lock.json

# Drop and recreate database
psql -U postgres
DROP DATABASE IF EXISTS sahambagus;
CREATE DATABASE sahambagus;
\c sahambagus
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q

# Reinstall from scratch
npm install
npx prisma generate
npx prisma db push

# Start fresh
npm run start:dev
```

---

## Getting Help

### Information to Provide When Asking for Help

1. **Error message** (full stack trace)
2. **What you were trying to do**
3. **What you've already tried**
4. **Environment:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: Windows/Mac/Linux
5. **Relevant code snippets**
6. **Console output**

### Debugging Checklist

- [ ] Is PostgreSQL running?
- [ ] Is Redis running?
- [ ] Is .env configured correctly?
- [ ] Did you run `npx prisma generate`?
- [ ] Did you restart TypeScript server?
- [ ] Did you check the logs?
- [ ] Did you try cleaning node_modules?
- [ ] Did you check for typos?

---

## Prevention Checklist

### Before Starting Development

- [ ] PostgreSQL is running
- [ ] Redis is running
- [ ] .env is configured
- [ ] Dependencies are installed
- [ ] Prisma Client is generated
- [ ] Database schema is applied
- [ ] Health check returns OK

### Before Committing Code

- [ ] Code compiles without errors
- [ ] Tests pass
- [ ] Linter passes
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] .env not committed

### Before Deploying

- [ ] All tests pass
- [ ] Health checks work
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Redis configured
- [ ] Logs configured

---

## Useful Commands Reference

```bash
# Application
npm run start:dev          # Start development server
npm run build             # Build for production
npm run start:prod        # Run production build

# Database
npx prisma generate       # Generate Prisma Client
npx prisma db push        # Apply schema changes
npx prisma studio         # Open database GUI
npx prisma migrate dev    # Create migration (production)

# Redis
redis-cli ping           # Test Redis connection
redis-cli KEYS "*"       # List all keys
redis-cli FLUSHALL       # Clear all data (dev only!)

# System
netstat -ano | findstr :3000   # Find process on port 3000
taskkill /PID <PID> /F         # Kill process (Windows)
pg_isready                     # Check PostgreSQL status

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to remote
```

---

## Known Limitations

1. **Windows Path Issues:** Use forward slashes in .env URLs
2. **WSL2 Networking:** Complex for Redis, use Windows native instead
3. **Prisma 7:** Breaking changes, stick to Prisma 6 for now
4. **TypeScript Cache:** Restart TS server after major changes
5. **Port Conflicts:** Always check if port is free before starting

---

**Remember:** Most issues are environment-related. When in doubt, restart everything! 🔄

_Last Updated: February 18, 2026_
