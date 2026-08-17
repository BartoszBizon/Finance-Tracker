# Finance Tracker

A finance tracking backend built with **C# and ASP.NET Core Web API** as a practical project for developing professional backend .NET skills.

The main focus of the project is the backend: REST API design, database access, authentication and authorization, external API integration, dependency injection, and separation of responsibilities.

## Tech Stack

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
- Financial Modeling Prep API

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- Stock CRUD operations
- Portfolio management
- Stock comments
- Pagination, filtering and sorting
- Entity Framework Core migrations
- Relational database mappings
- External financial API integration
- DTO-based API contracts
- Repository-based data access
- Swagger API documentation

## Backend Architecture

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

## Authentication

The application uses **ASP.NET Core Identity** for user management and **JWT Bearer tokens** for API authentication and authorization.

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
Authentication Middleware
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
- **Stocks** - CRUD operations, filtering, sorting and pagination
- **Portfolios** - manage user stock portfolios
- **Comments** - create, update and delete stock comments

Swagger/OpenAPI is configured for exploring and testing the API during development.

## Database

The current version uses **SQL Server** with **Entity Framework Core**.

The project uses EF Core migrations to manage database schema changes and defines relationships between users, stocks, portfolios and comments.

A planned next step is migrating the project from SQL Server to **PostgreSQL** using the **Npgsql EF Core provider**.

## External API Integration

The backend communicates with the **Financial Modeling Prep (FMP)** API to retrieve financial market data.

The integration uses `HttpClientFactory` and a dedicated service abstraction to keep external API communication separated from controllers and repositories.

## Running the Project

### Prerequisites

- .NET 10 SDK
- SQL Server
- Financial Modeling Prep API key

### Configuration

Configure the required connection string, JWT settings and external API settings using application configuration, user secrets or environment variables.

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

Swagger is available through the configured Swagger UI endpoint during development.

## Learning Roadmap

This project is also used as a practical backend learning environment.

Planned improvements:

1. Strengthen ASP.NET Core and Web API fundamentals
2. Deepen Entity Framework Core and SQL knowledge
3. Migrate SQL Server to PostgreSQL
4. Improve JWT authentication and authorization knowledge
5. Containerize the API and PostgreSQL with Docker Compose
6. Deploy the application to Azure
7. Learn microservice concepts and Kubernetes fundamentals

## Project Goal

The goal is to build a production-oriented .NET backend while developing the skills required for a **mid-level Backend .NET Developer** role.

The project focuses on practical backend concepts such as REST APIs, authentication, authorization, database relationships, migrations, external API integration, dependency injection and separation of responsibilities.