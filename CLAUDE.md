# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `yarn dev` - Start the development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint after making changes to ensure code quality
- `yarn start` - Start production server (after build)

## Project Structure
- NextJS 15.2.4 with App Router
- React 19.1.0
- TypeScript 5.6.2
- Tailwind CSS 3.4.1
- next-themes for dark/light mode
- Library loading system for external JS via LibraryLoader component
- Structured layout with auth-specific routes in (auth)/ directory
- Protected routes in (logged-in)/ directory

## Authentication Implementation
- Using NextAuth.js (formerly @auth/core and @auth/nextjs) for authentication
- PostgreSQL adapter (@auth/pg-adapter) - Import as a default export, not named export
- ClickHouse adapter (custom implementation) for analytics and usage tracking
- Automatic session strategy switching (JWT if no database, database sessions if available)
- Development-only features:
  - Auto-generated auth secret in development mode
  - Credentials provider for easy testing
- Supporting multiple auth methods:
  - Google OAuth
  - GitHub OAuth
  - Magic Link (email-based passwordless login)
  - Credentials provider (for development)

## Environment Variables
- Use CloudFlare Pages-compatible prefixes for all environment variables:
  - `NEXT_DATABASE_URL` for database connection string
  - `NEXT_CLICKHOUSE_*` for all ClickHouse variables
  - `NEXTAUTH_*` for auth-related variables
  - Keep `NEXTAUTH_SECRET` and `NEXTAUTH_URL` as they are
  - Keep `NEXT_PUBLIC_*` variables as they are
- Required variables:
  - `NEXTAUTH_SECRET` - For secure cookie encryption
  - `NEXTAUTH_URL` - For callback URLs and redirects
  - `NEXT_PUBLIC_APP_URL` - For client-side URL construction
- Optional but recommended:
  - `NEXT_DATABASE_URL` - For persistent user data
  - Auth provider credentials (varies by provider)
- Reference: See `cloudflare-env-migration-guide.md` for complete mapping
- Examples in `.env.local.example` and `.env.minimal` have correct prefixes
- Environment variables are conditionally checked and fallbacks provided where possible

## Code Style Guidelines
- Use 2-space indentation (no tabs)
- Import order: React/Next imports, third-party libs, local modules
- Theme components with appropriate classes (section-themed, card-themed, etc.)
- Use absolute imports with `@/` prefix (paths configured in tsconfig.json)
- Function components with named exports for components
- Keep components focused and modular
- Use TypeScript for type safety, though strict mode is disabled
- Follow naming conventions: camelCase for variables, PascalCase for components
- Always add proper type annotations for database query results to avoid "unknown" type errors
- Use appropriate provider components from _components/providers directory

## API Credit System
- Credit system spans both PostgreSQL and ClickHouse databases
- Each user gets default credits on account creation
- API usage is tracked and credits are deducted per request
- Usage statistics are available in the dashboard
- Credit operations are in credit-utils.ts (PostgreSQL) and clickhouse-credit-utils.ts
- Credit queries should always be properly typed to avoid runtime errors

## Error Handling
- Use try/catch blocks for async operations
- Handle loading and error states appropriately in components
- Log errors with appropriate context and error information
- For database operations, include query information with errors
- Validation checks should be done before database operations

## Database Handling
- Two database options: PostgreSQL (primary) and ClickHouse (analytics)
- PostgreSQL used with NextAuth via @auth/pg-adapter
- ClickHouse used for API usage tracking and credit management
- Always type ClickHouse query results to avoid TypeScript errors
- Example: `const result = rows[0] as { id: string; name: string; }`
- Use conditional database initialization based on environment variables
- Database schema initialization happens automatically in development
- ClickHouse queries use the query helper with proper error logging
- IMPORTANT: Avoid string interpolation in SQL queries to prevent injection

## Deployment
- Deployable to standard Next.js hosts like Vercel and CloudFlare Pages
- For CloudFlare Pages: ensure environment variables use proper prefixes
- PostgreSQL needs to be provisioned separately (not included in deployment)
- ClickHouse is optional but recommended for production API tracking
- .env variables should never be committed to the repository

## Post-Change Process
- After making changes, always run `yarn lint` to verify code quality
- Run `yarn build` to ensure the application builds without type errors
- Test critical flows after making authentication or database changes
- When deploying to CloudFlare Pages, make sure environment variables use proper prefixes
- Test with various authentication providers if changing auth-related code