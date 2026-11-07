# SIVEX — Backend API

**NestJS REST API supporting project management, volunteer enrollment, role-based workflows, evidence, and reporting for SIVEX.**

The backend is organized into domain modules and uses TypeORM with MySQL. It provides the services consumed by the [React/TypeScript frontend](https://github.com/CarlosA21/SIVEXFRONTEND).

## Technology stack

| Area | Technologies |
| --- | --- |
| Runtime and language | Node.js, TypeScript |
| Framework | NestJS 10 |
| Database and persistence | MySQL 8, TypeORM |
| Authentication | Passport JWT, `@nestjs/jwt`, bcrypt, session tracking |
| Validation | NestJS validation pipes, `class-validator`, DTOs |
| Email integrations | Nodemailer / NestJS Mailer, Gmail API via Google APIs |
| Tooling | ESLint, Prettier, Jest, Supertest |
| Container support | Docker, Docker Compose |

## Main capabilities

- **Users and roles:** user registration and management, role records, and project assignments.
- **Authentication:** JWT-based login, token verification, logout, and session checks.
- **Project management:** project records, project types, academic-unit associations, and assignment of coordinators and facilitators.
- **Participation workflows:** project requests, enrollment requests, enrollments, and role relationships between users and projects.
- **Activities and evidence:** activity management, file uploads, evidence metadata, and downloads.
- **Reporting:** KPI and detail endpoints for projects, users, activities, and enrollments.
- **Operational modules:** alerts, audit records, support tickets, sessions, and email/password recovery flows.

## Architecture

NestJS modules separate HTTP controllers, business services, DTOs, and TypeORM entities.

```text
src/
├── academic-units/        # Academic-unit records
├── activities/            # Project activity management
├── alerts/                # Notifications/alerts
├── audit/                 # Audit records
├── auth/                  # JWT strategy, guards, login/logout
├── enrollment-requests/  # Volunteer enrollment requests
├── enrollments/          # Project enrollments
├── evidence/              # Evidence uploads and downloads
├── mail/                  # Email delivery integrations
├── password-reset/       # Account recovery
├── project-requests/     # Project request workflow
├── projects/             # Projects, types, role assignments
├── reports/              # KPI and report endpoints
├── role/                 # Roles
├── sessions/             # Login session tracking
├── support/              # Support tickets
├── users/                # User management
├── app.module.ts         # Modules and database configuration
└── main.ts               # Application startup
```

The domain model includes projects associated with activities, reports, alerts, requests, enrollments, academic units, and users. Project participation roles are also represented explicitly through a `user_project_role` entity.

## Getting started

### Prerequisites

- Node.js 20 and npm (the repository Dockerfile uses Node 20).
- MySQL 8, with a database and application user available.
- Email provider credentials for the email-dependent features (e.g. password reset).

### 1. Clone and install

```bash
git clone https://github.com/CarlosA21/SIVEXBACKEND.git
cd SIVEXBACKEND
npm ci
```

### 2. Prepare the database

Create a MySQL database and assign the application user appropriate permissions. For example, using your MySQL administration tool:

```sql
CREATE DATABASE sivex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Use a separate, least-privilege application account rather than a production root account. Table synchronization in `src/app.module.ts` is currently enabled only when `NODE_ENV=development`; for production, use a reviewed migration process.

### 3. Configure environment variables

Create a `.env` file in the repository root and supply your own values:

```dotenv
# Application
NODE_ENV=development
PORT=3001
HOST_FRONTEND=http://localhost:5173

# MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=sivex

# Authentication
JWT_SECRET=replace_with_a_long_random_secret
JWT_TOKEN_EXPIRATION_TIME=2h

# SMTP integration (if using the mailer module)
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USER=your_smtp_user
MAIL_PASSWORD=your_smtp_password

# Gmail API integration (required for the current password-reset email flow)
GMAIL_USER=your_sender_email
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=your_oauth_redirect_uri
GMAIL_REFRESH_TOKEN=your_refresh_token
```

These names reflect configuration referenced in the repository. Real credentials must not be committed. Depending on the mail provider, additional external setup may be required before password-reset emails work.

### 4. Run the API

```bash
npm run start:dev
```

The application listens on port `3001` by default (or the port supplied through `PORT`).

## Docker support

The repository includes a multi-stage `Dockerfile` and a `docker-compose.yml` with MySQL and backend services. **Review and replace the example MySQL root password in the current Compose file before use.** The backend container reads a local `.env` file.

When running both services inside Compose, the API's database connection should use the Docker service hostname and container port:

```dotenv
DB_HOST=mysql
DB_PORT=3306
```

When the API runs directly on the host while MySQL runs through the supplied Compose port mapping, the corresponding host-side settings are `DB_HOST=127.0.0.1` and `DB_PORT=3307`.

The evidence module currently stores uploaded files in a local `uploads/` directory. In containerized deployments, configure persistent storage for that directory rather than relying on an ephemeral container filesystem.

## Selected API routes

The following examples come from the NestJS controllers; this is **not** an exhaustive API reference.

| Area | Method and path | Purpose |
| --- | --- | --- |
| Authentication | `POST /auth/login` | Sign in and obtain an access token |
| Authentication | `POST /auth/verify` | Verify a token |
| Authentication | `POST /auth/logout` | Close an authenticated session |
| Users | `GET /users` | List users |
| Projects | `GET /projects` | List projects |
| Projects | `POST /projects` | Create a project |
| Projects | `GET /projects/:id` | Get a project |
| Project requests | `POST /project-requests` | Submit a project request |
| Enrollment requests | `POST /enrollment-requests` | Submit an enrollment request |
| Evidence | `POST /evidence/file` | Upload evidence |
| Reports | `GET /reports/kpis` | Obtain dashboard metrics |
| Support | `POST /support/ticket` | Create a support ticket |

Some endpoints require `Authorization: Bearer <access_token>`; certain operations also apply role requirements. Check each controller's guards and authorization decorators before integrating a client. Route availability does not, by itself, establish that an endpoint has been hardened for public access.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Run the API in watch mode |
| `npm run build` | Compile the NestJS application |
| `npm run start:prod` | Start compiled code |
| `npm run lint` | Run ESLint (with automatic fixes) |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Generate test coverage |

**Testing note:** the current `test/app.e2e-spec.ts` contains the default scaffold test for a `Hello World!` root response. Replace or expand it with tests of real SIVEX behavior before treating the suite as evidence of application coverage.

## Security and deployment checklist

Before any production or publicly accessible deployment:

- Require an externally supplied, strong `JWT_SECRET`; remove the hardcoded JWT fallback currently present in authentication configuration.
- Replace the fixed database password in the checked-in Compose configuration; use secrets/environment configuration for deployments.
- Restrict CORS to trusted frontend origins. The current `main.ts` uses a wildcard origin together with credentials and needs review.
- Review authorization on sensitive controllers and enforce permissions on the server, not only in the frontend.
- Keep `.env` and uploaded files out of version control; review the repository and its history for secrets before publishing.
- Replace development schema synchronization with reviewed database migrations for production.
- Configure persistent evidence-file storage, backups, appropriate logging, and HTTPS at the infrastructure layer.

## Related project

- [SIVEX frontend — React/TypeScript application](https://github.com/CarlosA21/SIVEXFRONTEND)
