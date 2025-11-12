# NestJS GraphQL Search API

This project is a NestJS GraphQL API for searching authors and books.  
It is **based on a NestJS boilerplate**: [boilerplate](https://github.com/dmytroPolhul/nestjs-boilerplate).  
It uses **PostgreSQL** as a database and **Redis** for caching search results.  
Rate limiting is enabled to prevent excessive requests.

## Tech Stack

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[GraphQL](https://graphql.org/)** - Query language with Apollo Server
- **[TypeORM](https://typeorm.io/)** - Object-Relational Mapping
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Express](https://expressjs.com/)** - Web framework (NestJS default platform)
- **[JWT](https://jwt.io/)** - JSON Web Token authentication
- **[Docker](https://www.docker.com/)** - Containerization
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

## Features

- ✅ **GraphQL API** with Apollo Server integration
- ✅ **JWT Authentication** with refresh token strategy
- ✅ **Role-based Access Control** (RBAC) with guards and decorators
- ✅ **TypeORM** with PostgreSQL database
- ✅ **Database Migrations** management
- ✅ **Docker & Docker Compose** setup for development and production
- ✅ **Base Repository Pattern** for code reusability
- ✅ **Environment Configuration** with validation
- ✅ **GraphQL Playground** enabled for API exploration
- ✅ **CORS** enabled with credentials support
- ✅ **Cookie Parser** for handling cookies
- ✅ **Global Validation Pipe** with class-validator
- ✅ **Custom Naming Strategy** for database tables
- ✅ **ESLint & Prettier** for code quality
- ✅ **Jest** for unit and e2e testing
- ✅ **Conventional Commits** with Commitizen

## Prerequisites

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (v20 or higher)
- **[npm](https://www.npmjs.com/)** or **[yarn](https://yarnpkg.com/)**
- **[Docker](https://www.docker.com/products/docker-desktop)** (for Docker-based development)
- **[PostgreSQL](https://www.postgresql.org/)** (if running without Docker)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd graphQL-API-searching
```

### 2. Install dependencies

```bash
npm install
```

Or using the shorthand:

```bash
npm i
```

### 3. Environment Configuration

Copy the `.env-example` file to create your `.env` file:

```bash
cp .env-example .env
```

Update the `.env` file with your specific configuration:

```env
PORT=8000
BASE_HOST=0.0.0.0

POSTGRES_PORT=5432
DB_TYPE=postgres
DB_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DB_LOGGING=true

JWT_SECRET=your-secret-key-here
JWT_EXPIRE_IN=6000
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

Start the PostgreSQL database container:

```bash
docker compose up database -d
```

#### Option B: Local PostgreSQL

Ensure PostgreSQL is running locally and create a database matching your `.env` configuration.

### 5. Run Database Migrations

```bash
npm run mr
```

### 6. Start the Application

#### Development Mode

```bash
npm run start:dev
```

#### Production Mode

```bash
npm run build
npm run start:prod
```

The application will be available at:

- **API**: http://localhost:8000
- **GraphQL Playground**: http://localhost:8000/graphql

## Docker Development

### Run Full Stack with Docker Compose

Start all services (PostgreSQL + Application):

```bash
docker compose up
```

This will:

- Start PostgreSQL database on port 5432
- Redis runs on port 6379
- Build and start the NestJS application on port 8000
- Run migrations automatically
- Enable hot-reload for development

### Stop All Services

```bash
docker compose down
```

### Rebuild Containers

```bash
docker compose up --build
```

## Project Structure

```
src/
├── common/              # Shared utilities and decorators
│   ├── decorators/      # Custom decorators (e.g., @Auth, @CurrentUser)
│   ├── enums/           # Enums (UserRole, Ordering)
│   └── shared/          # Shared DTOs (Pagination, Sorting)
├── config/              # Configuration modules
│   ├── appConfig.module.ts
│   ├── naming.strategy.ts
│   └── orm.config.ts
├── database/            # Database configuration
│   ├── migrations/      # TypeORM migrations
│   ├── database.logger.ts
│   └── database.module.ts
├── modules/             # Feature modules
│   ├── auth/           # Authentication module (JWT, guards, strategies)
│   ├── baseModule/     # Base repository and service patterns
│   ├── user/           # User module (CRUD operations)
│   ├── book/              # Book module (CRUD, relations)
│   ├── author/            # Author module (CRUD, relations)
│   └── search/            # Search module (GraphQL search resolver)
├── app.module.ts       # Root application module
└── main.ts            # Application entry point
```

## Available Scripts

### Development

```bash
npm run start          # Start the application. Server runs on http://localhost:8000/graphql
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debug mode
```

### Building

```bash
npm run build          # Build the application
npm run prebuild       # Clean dist folder
```

### Code Quality

```bash
npm run lint           # Run ESLint with auto-fix
npm run format         # Format code with Prettier
npm run pre-commit     # Run lint and format
```

### Testing

```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Generate test coverage report
npm run test:debug     # Run tests in debug mode
npm run test:e2e       # Run end-to-end tests
```

### Database Migrations

```bash
npm run mc NAME=migration-name    # Create a new migration
npm run mg NAME=migration-name    # Generate migration from entities
npm run mr                        # Run pending migrations
npm run mre                       # Revert last migration
```

### Git Commits

```bash
npm run commit         # Create a conventional commit with Commitizen
```

## Database Migrations

This template uses TypeORM migrations for database schema management.

### Creating a New Migration

```bash
npm run mc NAME=add-user-table
```

### Generating Migration from Entities

```bash
npm run mg NAME=sync-entities
```

### Running Migrations

```bash
npm run mr
```

### Reverting Last Migration

```bash
npm run mre
```

### Run database migrations or seed script:

```bash
npm run seed        # This will populate the database with sample authors and books.
```

## Example Search GraphQL Query

```graphql
query {
  search(
    query: "search"
    filters: {
      genre: "genre name"
      publicationYearFrom: 2000
      publicationYearTo: 2025
    }
  ) {
    authors {
      name
    }
    books {
      title
      genre
      publicationYear
      author {
        name
      }
    }
  }
}
```

Sample Response:

```graphql
{
  "data": {
    "search": {
      "authors": [
        { "name": "J.K. Rowling" },
      ],
      "books": [
        {
          "title": "Harry Potter and the Goblet of Fire",
          "genre": "Fantasy",
          "publicationYear": 2000,
          "author": { "name": "J.K. Rowling" }
        }
      ]
    }
  }
}
```

### Rate Limiting

Rate limiting is enabled via @nestjs/throttler

Default: 10 requests per 6000 sec per IP

If the limit is exceeded, the server returns 429 Too Many Requests

### Caching with Redis

Search results are cached in Redis for 10 minutes (TTL)

## Authentication

The template includes a complete authentication system:

- **JWT Strategy** with access and refresh tokens
- **Auth Guards** for protecting routes
- **Role-based Guards** for authorization
- **Custom Decorators** for getting current user and checking roles

### Example GraphQL Queries

#### Register/Login

```graphql
mutation {
  register(input: { email: "user@example.com", password: "password123" }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

## Testing

### Run All Tests

```bash
npm run test
```

### Generate Coverage Report

```bash
npm run test:cov
```

Coverage reports are available in the `coverage/` directory.

## Module Pattern

The template follows a modular architecture with a base repository pattern:

1. **BaseModule** - Provides reusable base repository and service
2. **Feature Modules** - Extend base classes for specific features
3. **Repository Pattern** - Separates data access logic
4. **Service Layer** - Contains business logic
5. **Resolvers** - GraphQL entry points

### Creating a New Module

```bash
nest g module modules/feature-name
nest g service modules/feature-name
nest g resolver modules/feature-name
```

## Configuration

### Environment Variables

All configuration is managed through environment variables. See `.env-example` for all available options.

### TypeORM Configuration

Database configuration is located in `src/config/orm.config.ts` with:

- Custom naming strategy
- Migration paths
- Logging configuration
- Connection pooling

### GraphQL Configuration

GraphQL is configured in `app.module.ts` with:

- Auto schema generation
- GraphQL Playground enabled
- Context injection for request/response
- Schema sorting enabled

## Documentation

All available commands and scripts can be found in the `scripts` section of `package.json`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`npm run commit`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

**Dmytro Polhul**
