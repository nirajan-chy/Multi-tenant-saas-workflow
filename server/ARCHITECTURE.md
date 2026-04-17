# System Architecture

## Overview

This backend is a multi-tenant SaaS API built with Express, Sequelize, and PostgreSQL.
It is designed so every user request is authenticated, every organization acts as a tenant boundary, and every task query is scoped to a specific organization.

The system currently covers Week 1 foundations:

- Express API project setup
- PostgreSQL database design
- Sequelize ORM integration
- JWT authentication with refresh tokens
- Organization membership and role-based access control
- Organization-scoped task CRUD
- REST and Postman test collections

## Technology Stack

- Node.js for runtime
- Express for HTTP API
- Sequelize ORM for DB access and model associations
- PostgreSQL for persistent storage
- JWT for access token authentication
- bcryptjs for password hashing
- dotenv for environment config
- helmet, cors, and morgan for API hardening and logging

## High-Level Architecture

```mermaid
graph TD
  Client[Browser / Postman / REST Client] --> API[Express API]
  API --> MW[Middlewares: auth, org access, role checks, error handling]
  MW --> CTRL[Controllers]
  CTRL --> SVC[Services]
  SVC --> ORM[Sequelize Models + Associations]
  ORM --> DB[(PostgreSQL)]

  API --> H1[/GET /health]
  API --> H2[/GET /health/db]
```

## Request Flow

1. A client sends an HTTP request to an Express route.
2. Global middleware runs first: security headers, CORS, JSON parsing, and logging.
3. Route-specific middleware validates JWTs and organization membership.
4. Controllers validate request shape and pass normalized data to services.
5. Services contain the business logic and use Sequelize models for database operations.
6. Sequelize generates SQL and interacts with PostgreSQL.
7. Controllers return JSON responses.
8. Shared error middleware formats any failures.

## Layer Responsibilities

### 1. API Layer

Located in [src/routes](src/routes).

This layer defines endpoint paths and attaches middleware before controller handlers.

- [authRoutes.js](src/routes/authRoutes.js)
- [organizationRoutes.js](src/routes/organizationRoutes.js)
- [taskRoutes.js](src/routes/taskRoutes.js)

### 2. Controller Layer

Located in [src/controllers](src/controllers).

Controllers are thin request/response adapters.
They:

- validate required fields
- normalize input values
- call services
- send JSON responses

### 3. Service Layer

Located in [src/services](src/services).

Services hold the business rules.
They are responsible for:

- password hashing and verification
- JWT access and refresh token handling
- organization creation and membership management
- role-based access checks
- task CRUD and tenant scoping

### 4. Middleware Layer

Located in [src/middlewares](src/middlewares).

Middleware handles cross-cutting concerns:

- `authenticate` verifies Bearer tokens
- `requireOrganizationMember` ensures user belongs to a tenant
- `requireRole` restricts admin-only actions
- `errorHandler` formats API failures

### 5. Data Access Layer

Located in [src/models](src/models) and [src/config/db.js](src/config/db.js).

Sequelize models represent the database tables and their relationships.
The DB layer is responsible for:

- connecting to PostgreSQL
- defining associations
- mapping application entities to tables
- supporting transactions where needed

## Domain Model

### Users

Stores account identity and password hash.

Key fields:

- `id`
- `name`
- `email`
- `password_hash`
- timestamps

### Organizations

Represents a tenant.

Key fields:

- `id`
- `name`
- `created_by`
- timestamps

### Memberships

Bridge table between users and organizations.
This is what makes the application multi-tenant.

Key fields:

- `user_id`
- `organization_id`
- `role` (`admin` or `user`)

### Tasks

Tasks always belong to exactly one organization.

Key fields:

- `organization_id`
- `title`
- `description`
- `status` (`todo`, `in-progress`, `done`)
- `assigned_to`
- `created_by`

### Refresh Tokens

Stores server-side refresh token hashes so tokens can be revoked and rotated.

Key fields:

- `user_id`
- `token_hash`
- `expires_at`
- `revoked`

## Multi-Tenant Rules

The most important rule in this app is tenant isolation.

- A user can only access organizations they belong to.
- A task can only be read or modified inside its parent organization.
- Membership role decides whether the user can manage members or delete tasks.
- Organization membership is checked before tenant-scoped task routes run.

This prevents data from leaking across tenants.

## Authentication Architecture

### Login Flow

1. User submits email and password.
2. Password is checked with bcrypt.
3. Server issues a short-lived JWT access token.
4. Server creates a refresh token and stores only its hash in the database.

### Refresh Flow

1. Client sends refresh token.
2. Server hashes it and looks it up in `refresh_tokens`.
3. If token is valid and not revoked, server rotates it.
4. A new access token and refresh token are returned.

### Logout Flow

1. Client sends refresh token.
2. Server hashes it and marks the stored token as revoked.
3. The refresh token can no longer be used.

## Organization Access Model

When a user creates an organization:

- the organization row is created
- the creator is added to `memberships`
- the creator receives `admin` role

When a user is added to an organization:

- the service verifies the user exists
- the service verifies the organization exists
- a membership row is created or updated

## Task Access Model

Task routes are nested under organization routes:

- `GET /api/organizations/:organizationId/tasks`
- `POST /api/organizations/:organizationId/tasks`
- `PUT /api/organizations/:organizationId/tasks/:taskId`
- `DELETE /api/organizations/:organizationId/tasks/:taskId`

Before any task handler runs:

- the user must be authenticated
- the user must belong to that organization
- delete operations require `admin`

## Runtime Services

### Server Start

On startup the application:

1. loads environment variables
2. creates the Sequelize connection
3. checks database connectivity
4. syncs or initializes the schema
5. starts the Express server

### Health Checks

- `GET /health` confirms the API is running
- `GET /health/db` confirms PostgreSQL connectivity

## Testing Setup

Two API test entry points exist:

- [api-tests.rest](api-tests.rest) for VS Code REST Client
- [postman_collection.json](postman_collection.json) for Postman import

These are intended to cover the full Week 1 flow:

- register and login
- create organization
- add members
- create, update, and delete tasks
- refresh and logout

## Deployment Notes

For production, the following should be configured outside the codebase:

- environment variables
- PostgreSQL credentials and SSL settings
- access token secret rotation policy
- refresh token retention and cleanup strategy
- logging and monitoring for API and DB health

## Current Architectural Boundaries

What this project is doing right now:

- exposing a clean REST API
- isolating data by organization
- using Sequelize instead of raw SQL services
- keeping controllers thin and services focused
- keeping auth state mostly stateless with JWT access tokens and revocable refresh tokens

What it is not doing yet:

- background jobs
- audit logging
- file storage
- billing/subscription management
- webhook processing
- API rate limiting

Those can be added cleanly later without changing the core tenant model.
