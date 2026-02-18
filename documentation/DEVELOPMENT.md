# SahamBagus - Development Guide

**For:** Developers joining the project  
**Last Updated:** February 18, 2026

---

## Quick Start

### Prerequisites

```bash
# Check versions
node --version    # Should be v24+
npm --version     # Should be v10+
psql --version    # Should be v15+
redis-cli --version
```

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd sahambagus-api

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 4. Setup database
createdb sahambagus
psql -d sahambagus -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# 5. Generate Prisma Client
npx prisma generate

# 6. Push database schema
npx prisma db push

# 7. Start development server
npm run start:dev

# 8. Verify health
curl http://localhost:3000/api/v1/health/ready
```

---

## Project Structure

```
sahambagus-api/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── config/
│   │   └── app.config.ts       # App configuration
│   ├── modules/
│   │   ├── health/             # Health check module
│   │   ├── news/               # News module (Phase 2)
│   │   ├── analysis/           # Analysis module (Phase 2)
│   │   └── auth/               # Auth module (Phase 6)
│   ├── shared/
│   │   ├── cache/              # Redis service
│   │   ├── database/           # Prisma service
│   │   ├── exceptions/         # Custom exceptions
│   │   ├── filters/            # Exception filters
│   │   ├── interceptors/       # Logging & Response
│   │   └── response/           # Standard response format
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application entry point
├── .env                        # Environment variables (gitignored)
├── .env.example                # Environment template
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## Development Workflow

### Daily Development

```bash
# Start with fresh terminal
npm run start:dev

# Application will:
# - Compile TypeScript
# - Start server on port 3000
# - Watch for file changes
# - Auto-reload on save

# In another terminal:
# Open Prisma Studio (optional)
npx prisma studio
```

### Making Changes

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow Clean Architecture layers
   - Write tests for use cases
   - Update relevant documentation

3. **Test locally**
   ```bash
   npm run test              # Unit tests
   npm run test:e2e          # E2E tests
   npm run lint              # Check code style
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

---

## Coding Standards

### File Naming Convention

```
kebab-case for files:
  news.entity.ts
  create-news.use-case.ts
  news.controller.ts

PascalCase for classes:
  NewsEntity
  CreateNewsUseCase
  NewsController

camelCase for variables/functions:
  const newsSlug = "...";
  function generateSlug() {}
```

### Module Structure (Mandatory)

```
src/modules/your-module/
├── domain/
│   ├── entities/           # Business entities
│   ├── value-objects/      # Immutable value objects
│   ├── events/             # Domain events
│   └── repositories/       # Repository interfaces
├── application/
│   ├── use-cases/          # Business use cases
│   ├── dtos/               # Data transfer objects
│   └── mappers/            # Entity ↔ DTO mappers
├── infrastructure/
│   ├── repositories/       # Repository implementations
│   └── services/           # External service clients
└── presentation/
    ├── controllers/        # HTTP controllers
    └── dtos/               # Request/Response DTOs
```

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit types
function createNews(dto: CreateNewsDto): Promise<NewsResponseDto> {
  // ...
}

// ❌ DON'T: Use 'any'
function createNews(dto: any): any {
  // ...
}

// ✅ DO: Use readonly when appropriate
class NewsEntity {
  constructor(
    public readonly id: string,
    public readonly slug: string,
  ) {}
}

// ✅ DO: Use async/await (not .then)
async function getNews(slug: string): Promise<News> {
  const news = await this.repository.findBySlug(slug);
  return news;
}

// ❌ DON'T: Use .then chains
function getNews(slug: string) {
  return this.repository.findBySlug(slug)
    .then(news => news);
}
```

---

## Database Development

### Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Push changes to database
npx prisma db push

# 3. Regenerate Prisma Client
npx prisma generate

# 4. Restart dev server (will auto-restart)
```

### Viewing Database

```bash
# Option 1: Prisma Studio (GUI)
npx prisma studio
# Opens http://localhost:5555

# Option 2: psql (CLI)
psql -d sahambagus
\dt                  # List tables
\d news             # Describe news table
SELECT * FROM news; # Query data
```

### Common Queries

```sql
-- Check database exists
\l

-- Switch database
\c sahambagus

-- List all tables
\dt

-- Describe table structure
\d news

-- Check indexes
\di

-- Check extensions
\dx

-- View table with deleted records
SELECT * FROM news WHERE "deletedAt" IS NOT NULL;
```

---

## Redis Development

### Start Redis

**Windows:**
```bash
C:\Redis\redis-server.exe
```

**Linux/Mac:**
```bash
redis-server
```

### Redis CLI Commands

```bash
# Connect to Redis
redis-cli

# Test connection
PING              # Should return PONG

# View all keys
KEYS *

# Get a value
GET news:slug:example-slug

# Delete a key
DEL news:slug:example-slug

# View TTL
TTL news:slug:example-slug

# Flush all (DANGER: dev only!)
FLUSHALL
```

---

## Testing

### Unit Tests

```typescript
// Example: create-news.use-case.spec.ts
describe('CreateNewsUseCase', () => {
  let useCase: CreateNewsUseCase;
  let mockRepo: jest.Mocked<INewsRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      findBySlug: jest.fn(),
    };
    useCase = new CreateNewsUseCase(mockRepo);
  });

  it('should create news with valid data', async () => {
    const dto = { title: 'Test News', content: 'Content' };
    
    await useCase.execute(dto);
    
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });
});
```

Run tests:
```bash
npm run test                    # All unit tests
npm run test:watch             # Watch mode
npm run test:cov               # With coverage
npm run test -- news.spec.ts   # Single file
```

### Integration Tests

```typescript
// Example: news.controller.spec.ts
describe('NewsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/api/v1/news (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/news')
      .send({ title: 'Test', content: 'Content' })
      .expect(201);
  });
});
```

---

## API Development

### Creating a New Endpoint

1. **Define DTO** (presentation/dtos/)
   ```typescript
   export class CreateNewsRequestDto {
     @IsString()
     @IsNotEmpty()
     title: string;

     @IsString()
     @IsNotEmpty()
     content: string;
   }
   ```

2. **Create Use Case** (application/use-cases/)
   ```typescript
   export class CreateNewsUseCase {
     constructor(private repo: INewsRepository) {}

     async execute(dto: CreateNewsDto): Promise<NewsResponseDto> {
       const news = NewsEntity.create(dto);
       await this.repo.save(news);
       return NewsMapper.toDto(news);
     }
   }
   ```

3. **Add Controller Endpoint** (presentation/controllers/)
   ```typescript
   @Controller('news')
   export class NewsController {
     @Post()
     async create(@Body() dto: CreateNewsRequestDto) {
       const result = await this.createNews.execute(dto);
       return ApiResponse.success(result);
     }
   }
   ```

4. **Test Endpoint**
   ```bash
   curl -X POST http://localhost:3000/api/v1/news \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","content":"Content"}'
   ```

---

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/main.ts"],
      "cwd": "${workspaceFolder}",
      "protocol": "inspector",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Logging

```typescript
// Use NestJS Logger
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  someMethod() {
    this.logger.log('Info message');
    this.logger.warn('Warning message');
    this.logger.error('Error message', stackTrace);
    this.logger.debug('Debug message');
  }
}
```

### Performance Profiling

```typescript
// Check slow queries in logs
[HTTP] POST /api/v1/news 200 - 245ms ⚠️ Slow response

// Add timing to use cases
const start = Date.now();
await this.repository.save(news);
this.logger.log(`Save took ${Date.now() - start}ms`);
```

---

## Common Tasks

### Add a New Module

```bash
# Generate module structure
nest g module modules/new-module
nest g controller modules/new-module/presentation/controllers/new-module
nest g service modules/new-module/application/services/new-module

# Or manually create folders:
mkdir -p src/modules/new-module/{domain,application,infrastructure,presentation}
```

### Add a New Environment Variable

1. Add to `.env`:
   ```env
   NEW_VARIABLE=value
   ```

2. Add to `.env.example`:
   ```env
   NEW_VARIABLE=your-value
   ```

3. Add to `src/config/app.config.ts`:
   ```typescript
   export default () => ({
     newFeature: {
       variable: process.env.NEW_VARIABLE,
     },
   });
   ```

4. Use in code:
   ```typescript
   const value = this.configService.get<string>('newFeature.variable');
   ```

### Database Migration (Production)

```bash
# 1. Create migration
npx prisma migrate dev --name add_new_field

# 2. Review migration SQL
cat prisma/migrations/xxx_add_new_field/migration.sql

# 3. Apply to production
npx prisma migrate deploy
```

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Out of Sync

```bash
npx prisma generate
npm run start:dev
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check .env DATABASE_URL is correct
cat .env | grep DATABASE_URL

# Test connection
psql -d sahambagus
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# If Windows: Check if redis-server.exe is running
# If not: C:\Redis\redis-server.exe
```

### TypeScript Errors After Pull

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npx prisma generate
npm run start:dev
```

---

## Best Practices

### Do's ✅

- Write use cases for all business logic
- Use DTOs for all API inputs/outputs
- Write tests for use cases
- Use meaningful variable names
- Log important actions
- Handle errors gracefully
- Use transactions for multi-step operations
- Invalidate cache after data changes
- Document complex business rules
- Use TypeScript strict mode

### Don'ts ❌

- Don't put business logic in controllers
- Don't use 'any' type
- Don't expose internal IDs in API
- Don't return entities from controllers
- Don't skip input validation
- Don't hardcode configuration
- Don't commit .env file
- Don't use console.log (use Logger)
- Don't expose stack traces
- Don't skip tests

---

## Resources

### Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Tools
- [Prisma Studio](http://localhost:5555)
- [Health Check](http://localhost:3000/api/v1/health/ready)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Team Communication
- Ask questions in team chat
- Document solutions to common problems
- Share learnings in retrospectives
- Review each other's code

---

## Getting Help

### Common Questions

**Q: Where should I put business logic?**  
A: In domain entities or use cases, never in controllers.

**Q: How do I query the database?**  
A: Use Prisma service injected in repositories.

**Q: How do I handle errors?**  
A: Throw custom exceptions from shared/exceptions.

**Q: How do I test use cases?**  
A: Mock repositories, test business logic in isolation.

**Q: How do I add a new API endpoint?**  
A: Create DTO → Use Case → Controller endpoint.

---

## Next Steps

Once comfortable with development:

1. Read ARCHITECTURE.md for design decisions
2. Review TROUBLESHOOTING.md for common issues
3. Start implementing Phase 2 features
4. Write tests for your code
5. Review code with team

---

**Happy Coding!** 🚀

*Last Updated: February 18, 2026*
