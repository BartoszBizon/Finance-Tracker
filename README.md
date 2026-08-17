# Finance Tracker

A full-stack finance tracking application built as a learning project while transitioning from Unity/C# development to backend .NET development.

The project focuses primarily on the **ASP.NET Core Web API** backend. The frontend is included in the repository, but the main development focus is the backend architecture, database access, authentication, and API design.

## Tech Stack

### Backend

- C#
- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- JWT Bearer Authentication
- Swagger / OpenAPI
- LINQ
- Dependency Injection
- Repository Pattern
- `HttpClientFactory`
- External Financial Modeling Prep API

### Frontend

- React
- TypeScript

## Backend Features

- User registration and login
- JWT authentication
- Role-based authorization
- Stock CRUD operations
- Portfolio management
- Comments for stocks
- Pagination, filtering and sorting
- Entity Framework Core migrations
- Relational database mappings
- Communication with an external financial API
- DTO-based API contracts
- Repository-based data access
- Dependency Injection
- Swagger API documentation

## Architecture

The API is organized around controllers, DTOs, repositories, services, models and the EF Core database context.

```text
Client
  |
  v
ASP.NET Core Web API
  |
  +-- Controllers
  |     |
  |     +-- AccountController
  |     +-- StockController
  |     +-- PortfolioController
  |     +-- CommentController
  |
  +-- Repositories
  |     |
  |     +-- StockRepository
  |     +-- PortfolioRepository
  |     +-- CommentRepository
  |
  +-- Services
  |     |
  |     +-- TokenService
  |     +-- FMPService
  |
  +-- Entity Framework Core
  |     |
  |     +-- ApplicationDBContext
  |     +-- Migrations
  |
  v
SQL Server
```

## Authentication Flow

The application uses ASP.NET Core Identity for user management and JWT Bearer tokens for API authentication.

```text
Register / Login
       |
       v
ASP.NET Core Identity
       |
       v
TokenService
       |
       v
JWT Token
       |
       v
Authorization: Bearer <token>
       |
       v
ASP.NET Core Authentication Middleware
       |
       v
[Authorize]
       |
       v
Controller
```

## API

The backend contains endpoints for:

- **Account** - registration, login and authentication
- **Stocks** - create, read, update and delete stocks, including filtering, sorting and pagination
- **Portfolios** - manage user stock portfolios
- **Comments** - create, update and delete stock comments

Swagger/OpenAPI can be used to explore and test the API during development.

## Database

The current version uses **SQL Server** with Entity Framework Core.

The project uses EF Core migrations to manage database schema changes and includes relationships between users, stocks, portfolios and comments.

One of the planned improvements is migrating the project from **SQL Server to PostgreSQL using the Npgsql EF Core provider**.

## External API

The backend communicates with the **Financial Modeling Prep (FMP)** API to retrieve financial market data.

The integration uses `HttpClientFactory` and a dedicated service abstraction so that external API communication is separated from controllers and repositories.

## Running the Project

### Prerequisites

- .NET 10 SDK
- SQL Server
- A configured Financial Modeling Prep API key

### Configuration

Configure the required connection string, JWT settings and external API settings in the application's configuration (`appsettings.json` / user secrets / environment variables).

Do not commit real API keys, passwords or signing secrets to the repository.

### Run the API

```bash
dotnet restore
dotnet build
dotnet run
```

Apply EF Core migrations when required:

```bash
dotnet ef database update
```

Swagger is available during development through the configured Swagger UI endpoint.

## Learning Roadmap

This project is also used as a practical backend learning environment.

Planned next steps:

1. Strengthen ASP.NET Core and Web API fundamentals
2. Deepen Entity Framework Core and SQL knowledge
3. Migrate SQL Server to PostgreSQL
4. Improve JWT authentication and authorization knowledge
5. Containerize the API and PostgreSQL with Docker Compose
6. Deploy the application to Azure
7. Learn microservice concepts and Kubernetes fundamentals

## Project Goal

The goal is to build a production-oriented .NET backend while developing the skills required for a **mid-level Backend .NET Developer** role.

The project intentionally uses real backend concepts such as authentication, authorization, database relationships, migrations, external API integration, dependency injection and layered separation of responsibilities instead of being limited to a simple CRUD example.
