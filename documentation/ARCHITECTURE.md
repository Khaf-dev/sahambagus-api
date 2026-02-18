# SahamBagus - Architecture Documentation

**Version:** 1.0  
**Last Updated:** February 18, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Principles](#design-principles)
3. [Layered Architecture](#layered-architecture)
4. [Module Structure](#module-structure)
5. [Data Flow](#data-flow)
6. [Database Design](#database-design)
7. [Caching Strategy](#caching-strategy)
8. [API Design](#api-design)
9. [Security Architecture](#security-architecture)
10. [Scalability Design](#scalability-design)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────┐
│   Client    │ (Web/Mobile)
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────────────────────────────┐
│         API Gateway (Future)        │
│    Rate Limiting, Auth, Routing     │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│        NestJS Application           │
│  ┌───────────────────────────────┐  │
│  │  Presentation Layer           │  │
│  │  (Controllers, DTOs)          │  │
│  └───────────┬───────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │  Application Layer            │  │
│  │  (Use Cases, Services)        │  │
│  └───────────┬───────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │  Domain Layer                 │  │
│  │  (Entities, Value Objects)    │  │
│  └───────────┬───────────────────┘  │
│              ↓                      │
│  ┌───────────────────────────────┐  │
│  │  Infrastructure Layer         │  │
│  │  (Repositories, External)     │  │
│  └───────────┬───────────────────┘  │
└──────────────┼──────────────────────┘
               │
       ┌───────┴────────┐
       ↓                ↓
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │    Redis    │
│  Database   │  │    Cache    │
└─────────────┘  └─────────────┘
```

---

## Design Principles

### 1. Clean Architecture

**Why:** Separation of concerns, testability, maintainability

**How:**
- Domain layer has zero dependencies
- Application layer depends only on domain
- Infrastructure implements domain interfaces
- Presentation depends on application

### 2. API-First Design

**Why:** Support multiple clients (Web + Mobile)

**How:**
- REST API with standard responses
- Versioned endpoints (/api/v1)
- Mobile-friendly JSON responses
- Backward compatibility guarantee

### 3. Domain-Driven Design

**Why:** Model complex business rules

**How:**
- Aggregate roots (News, Analysis)
- Value objects (Slug, Status)
- Domain events (NewsPublished)
- Repository pattern

### 4. Security by Default

**Why:** Protect user data and prevent attacks

**How:**
- No stack traces in responses
- Input validation on all requests
- SQL injection prevention (Prisma)
- CORS whitelist

### 5. Performance-Aware

**Why:** Target <200ms response time

**How:**
- Redis caching layer
- Database indexing strategy
- Query optimization
- Performance monitoring

### 6. Scalability by Design

**Why:** Handle growth without refactor

**How:**
- Stateless application
- Horizontal scaling ready
- Event-driven architecture (future)
- Microservices-ready modules

---

## Layered Architecture

### Layer Dependencies (Top to Bottom)

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓          ↑            ↓
Controllers    Use Cases   Entities   Repositories
   DTOs        Services    Value Obj    Database
Validation    Orchestr.   Bus. Rules   External APIs
```

### Layer Responsibilities

#### 1. Domain Layer (`domain/`)

**Purpose:** Core business logic, entities, rules

**Contents:**
- Entities (News, Analysis, User)
- Value Objects (Slug, ContentStatus, Email)
- Domain Events (NewsPublished)
- Domain Exceptions
- Repository Interfaces

**Rules:**
- ✅ Pure business logic only
- ✅ No framework dependencies
- ✅ No HTTP/database code
- ✅ Highly testable

**Example:**
```typescript
// domain/entities/news.entity.ts
export class NewsEntity {
  private constructor(
    public readonly id: string,
    public readonly slug: Slug,
    public readonly title: string,
    private status: ContentStatus,
  ) {}

  publish(publishedBy: string): void {
    if (this.status !== ContentStatus.REVIEW) {
      throw new DomainException('Can only publish from REVIEW status');
    }
    this.status = ContentStatus.PUBLISHED;
    // Emit NewsPublishedEvent
  }
}
```

#### 2. Application Layer (`application/`)

**Purpose:** Use cases, orchestration, DTOs

**Contents:**
- Use Cases (CreateNewsUseCase)
- Application Services
- DTOs (Input/Output)
- Interfaces for repositories
- Transaction boundaries

**Rules:**
- ✅ Orchestrates domain objects
- ✅ Handles transactions
- ✅ No business rules (delegate to domain)
- ✅ Returns DTOs, not entities

**Example:**
```typescript
// application/use-cases/create-news.use-case.ts
export class CreateNewsUseCase {
  constructor(
    private newsRepo: INewsRepository,
    private slugService: SlugService,
  ) {}

  async execute(input: CreateNewsDto): Promise<NewsResponseDto> {
    // 1. Generate slug
    const slug = await this.slugService.generate(input.title);
    
    // 2. Create entity
    const news = NewsEntity.create({...input, slug});
    
    // 3. Save
    await this.newsRepo.save(news);
    
    // 4. Return DTO
    return NewsMapper.toDto(news);
  }
}
```

#### 3. Infrastructure Layer (`infrastructure/`)

**Purpose:** External dependencies, persistence

**Contents:**
- Repository implementations
- Database queries (Prisma)
- External API clients
- File storage
- Message queues

**Rules:**
- ✅ Implements domain interfaces
- ✅ Handles persistence
- ✅ No business logic
- ✅ Converts domain ↔ persistence models

**Example:**
```typescript
// infrastructure/repositories/news.repository.ts
export class NewsRepository implements INewsRepository {
  constructor(private prisma: PrismaService) {}

  async save(news: NewsEntity): Promise<void> {
    await this.prisma.news.create({
      data: NewsMapper.toPersistence(news),
    });
  }

  async findBySlug(slug: string): Promise<NewsEntity | null> {
    const record = await this.prisma.news.findUnique({
      where: { slug },
    });
    return record ? NewsMapper.toDomain(record) : null;
  }
}
```

#### 4. Presentation Layer (`presentation/`)

**Purpose:** HTTP handling, validation, serialization

**Contents:**
- Controllers
- Request/Response DTOs
- Validation decorators
- Serialization
- API documentation

**Rules:**
- ✅ HTTP concerns only
- ✅ Delegates to use cases
- ✅ Returns standard ApiResponse
- ✅ No business logic

**Example:**
```typescript
// presentation/controllers/news.controller.ts
@Controller('news')
export class NewsController {
  constructor(private createNews: CreateNewsUseCase) {}

  @Post()
  async create(@Body() dto: CreateNewsRequestDto) {
    const result = await this.createNews.execute(dto);
    return ApiResponse.success(result);
  }
}
```

---

## Module Structure

### Standard Module Layout

```
src/modules/news/
├── domain/
│   ├── entities/
│   │   └── news.entity.ts
│   ├── value-objects/
│   │   ├── slug.vo.ts
│   │   └── content-status.vo.ts
│   ├── events/
│   │   └── news-published.event.ts
│   └── repositories/
│       └── news.repository.interface.ts
├── application/
│   ├── use-cases/
│   │   ├── create-news.use-case.ts
│   │   ├── publish-news.use-case.ts
│   │   └── list-news.use-case.ts
│   ├── dtos/
│   │   ├── create-news.dto.ts
│   │   └── news-response.dto.ts
│   └── mappers/
│       └── news.mapper.ts
├── infrastructure/
│   ├── repositories/
│   │   └── news.repository.ts
│   └── services/
│       └── slug-generator.service.ts
└── presentation/
    ├── controllers/
    │   └── news.controller.ts
    └── dtos/
        └── create-news-request.dto.ts
```

### Module Independence

**Rules:**
- Each module is a bounded context
- Modules communicate via events (future)
- No direct imports between modules
- Shared code goes in `/shared`

---

## Data Flow

### Read Flow (GET /api/v1/news/:slug)

```
1. Request arrives
   ↓
2. Global Interceptor (Logging) starts timer
   ↓
3. Controller receives request
   ↓
4. Validation Pipe validates params
   ↓
5. Use Case executes
   ↓
6. Repository queries database (with cache check)
   ↓
7. Domain entity returned
   ↓
8. Mapper converts to DTO
   ↓
9. Controller returns
   ↓
10. Response Interceptor wraps in ApiResponse
    ↓
11. Logging Interceptor logs duration
    ↓
12. Response sent to client
```

### Write Flow (POST /api/v1/news)

```
1. Request arrives
   ↓
2. Validation Pipe validates body
   ↓
3. Use Case executes
   ↓
4. Domain entity created with business rules
   ↓
5. Repository saves to database
   ↓
6. Cache invalidation triggered
   ↓
7. Domain event emitted (future)
   ↓
8. DTO returned
   ↓
9. Response wrapped and sent
```

---

## Database Design

### Schema Principles

1. **UUID Primary Keys**
   - Why: Distributed system ready, no ID conflicts
   - Implementation: uuid_generate_v4()

2. **Soft Delete**
   - Why: Data recovery, audit trail
   - Implementation: deletedAt timestamp

3. **Indexing Strategy**
   - Slug (unique, frequently queried)
   - Status + PublishedAt (composite, for filtering)
   - Partial index on published content

4. **Timestamp Tracking**
   - createdAt, updatedAt (automatic)
   - publishedAt, archivedAt (business logic)

5. **Relationship Design**
   - User → News (author)
   - User → News (editor)
   - Separate tables (no shared content table)

### Migration Strategy

**Development:**
- Use `prisma db push` for rapid prototyping
- Schema changes immediate

**Production:**
- Use `prisma migrate` for versioned migrations
- Zero-downtime deployments
- Rollback capability

---

## Caching Strategy

### Redis Usage

**Cache Keys Pattern:**
```
app:status              → Application status
news:slug:{slug}        → Single news by slug
news:list:page:{n}      → Paginated news list
news:published:count    → Count cache
```

**TTL Strategy:**
- Individual items: 300s (5 minutes)
- Lists: 60s (1 minute)
- Counts: 120s (2 minutes)

**Cache Invalidation:**
- On create: Clear lists
- On update: Clear specific item + lists
- On publish: Clear all news caches
- On delete: Clear specific item + lists

### Cache-Aside Pattern

```typescript
async getBySlug(slug: string): Promise<News> {
  // 1. Check cache
  const cached = await redis.get(`news:slug:${slug}`);
  if (cached) return JSON.parse(cached);

  // 2. Query database
  const news = await db.news.findUnique({ where: { slug } });

  // 3. Set cache
  if (news) {
    await redis.set(`news:slug:${slug}`, JSON.stringify(news), 300);
  }

  return news;
}
```

---

## API Design

### REST Principles

1. **Resource-Based URLs**
   ```
   GET    /api/v1/news           → List news
   POST   /api/v1/news           → Create news
   GET    /api/v1/news/:slug     → Get one news
   PATCH  /api/v1/news/:slug     → Update news
   DELETE /api/v1/news/:slug     → Delete news
   ```

2. **HTTP Verbs Correctly**
   - GET: Idempotent, cacheable
   - POST: Create, not idempotent
   - PUT: Replace entire resource
   - PATCH: Partial update
   - DELETE: Remove resource

3. **Status Codes**
   - 200: Success with body
   - 201: Created
   - 204: Success, no content
   - 400: Bad request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not found
   - 409: Conflict
   - 422: Validation error
   - 429: Too many requests
   - 500: Server error

### Response Format

**Always JSON, Always Consistent:**

```json
{
  "data": { ... } | null,
  "meta": { 
    "timestamp": "ISO8601",
    "version": "v1",
    "path": "/api/v1/..."
  } | null,
  "error": { 
    "code": "ERROR_CODE",
    "message": "Human readable"
  } | null
}
```

### Versioning Strategy

**Current:** URL-based versioning (`/api/v1`)

**Rules:**
- Major version in URL
- Breaking changes = new version
- Support N-1 version minimum
- Deprecation warnings 6 months before EOL

---

## Security Architecture

### Defense Layers

1. **Input Validation**
   - All inputs validated with class-validator
   - DTOs enforce structure
   - No raw SQL ever

2. **Authentication** (Phase 6)
   - JWT tokens
   - Refresh token rotation
   - Secure httpOnly cookies

3. **Authorization** (Phase 6)
   - Role-based access control
   - Resource-level permissions
   - Editor can DRAFT/REVIEW
   - Admin can PUBLISH

4. **Rate Limiting** (Phase 7)
   - IP-based throttling
   - API key tiers
   - Sliding window algorithm

5. **Data Protection**
   - No sensitive data in logs
   - No stack traces in responses
   - Passwords hashed (bcrypt)
   - Secrets in environment variables

---

## Scalability Design

### Horizontal Scaling

**Current State:**
- Stateless application ✅
- No local session storage ✅
- Redis for shared state ✅

**Scale to N instances:**
```
          Load Balancer
         /      |      \
      App1    App2    App3
         \      |      /
          PostgreSQL
              |
            Redis
```

### Database Scaling

**Read Replicas (Phase 10):**
```
Primary (writes)
    ↓
Replica1, Replica2 (reads)
```

**Partitioning Strategy (Future):**
- Partition news by publishedAt (monthly)
- Keep recent 2 years hot
- Archive older to cold storage

### Caching Layers

```
Client
  ↓ (CDN cache)
CDN
  ↓ (Redis cache)
Application
  ↓ (DB query)
Database
```

---

## Technology Decisions

### Why NestJS?

✅ Built-in dependency injection  
✅ TypeScript-first  
✅ Modular architecture  
✅ Testing framework included  
✅ Large ecosystem  
✅ Active community  

### Why Prisma?

✅ Type-safe queries  
✅ Migration system  
✅ Auto-completion  
✅ Easy debugging  
✅ Good performance  

### Why PostgreSQL?

✅ ACID compliance  
✅ Full-text search  
✅ JSON support  
✅ Mature ecosystem  
✅ Excellent indexing  

### Why Redis?

✅ Fast (in-memory)  
✅ Simple data structures  
✅ Wide adoption  
✅ Pub/sub support  
✅ Session storage ready  

---

## Future Architecture

### Event-Driven (Phase 10)

```
NewsPublishedEvent
    ↓
Message Broker (Kafka/NATS)
    ↓
    ├─→ Email Service
    ├─→ Analytics Service
    ├─→ Search Indexer
    └─→ Notification Service
```

### Microservices (Future)

```
API Gateway
    ↓
    ├─→ News Service
    ├─→ Analysis Service
    ├─→ User Service
    ├─→ Media Service
    └─→ Notification Service
```

---

## Design Trade-offs

### Clean Architecture
- **Pro:** Testability, maintainability
- **Con:** More code, steeper learning curve
- **Decision:** Worth it for long-term

### API-First
- **Pro:** Multi-client support
- **Con:** Can't leverage server-side rendering
- **Decision:** Mobile requirement makes this mandatory

### Soft Delete
- **Pro:** Data recovery, audit trail
- **Con:** Queries more complex (WHERE deletedAt IS NULL)
- **Decision:** Safety > convenience

### Redis Caching
- **Pro:** Performance boost
- **Con:** Cache invalidation complexity
- **Decision:** Target <200ms requires this

---

## References

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

*Last Updated: February 18, 2026*
