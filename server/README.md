# Multi-Tenant SaaS Backend (Week 1)

Express + PostgreSQL backend that includes:

- User registration and login
- JWT access tokens + refresh token rotation
- Protected routes middleware
- Organization-based multi-tenancy with memberships
- Role-based access (`admin`, `user`)
- Organization-scoped task CRUD

## 1. Setup

```bash
npm install
npm run dev
```

Server starts on the configured port (`5000` by default). On startup it auto-creates DB tables.

## 2. Environment

Use `.env` (already added in your workspace) with keys:

- `PORT`
- `DB_NAME`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRES_IN` (optional)
- `REFRESH_TOKEN_EXPIRES_DAYS` (optional)

## 3. API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me` (Bearer token required)

### Organizations

- `GET /api/organizations` (list orgs for current user)
- `POST /api/organizations` (create org, creator becomes admin)
- `POST /api/organizations/:organizationId/members` (admin only)

### Tasks (scoped by organization)

- `GET /api/organizations/:organizationId/tasks`
- `POST /api/organizations/:organizationId/tasks`
- `PUT /api/organizations/:organizationId/tasks/:taskId`
- `DELETE /api/organizations/:organizationId/tasks/:taskId` (admin only)

## 4. Postman Test Flow (Day 7)

1. Register two users.
2. Login as user A and store `accessToken` + `refreshToken`.
3. Create an organization with user A.
4. Add user B as member (admin route).
5. Create tasks in that organization.
6. Verify user from another org cannot access tasks outside their membership.
7. Test refresh token endpoint and logout.

## 5. API Collections For Testing

- VS Code REST Client file: `api-tests.rest`
  - Open the file and click `Send Request` on each section.
  - It automatically stores `accessToken`, `refreshToken`, `organizationId`, and `taskId` as you run.

- Postman import file: `postman_collection.json`
  - Import this file into Postman.
  - Update variables (`userBId`, `organizationId`, `taskId`) based on your database values.
