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

## Authentication Implementation
- Using NextAuth.js (formerly @auth/core and @auth/nextjs) for authentication
- PostgreSQL adapter (@auth/pg-adapter) - Import as a default export, not named export
- ClickHouse adapter (custom implementation) for analytics and usage tracking
- Supporting multiple auth methods:
  - Google OAuth
  - GitHub OAuth
  - Magic Link (email-based passwordless login)
  - Credentials provider (for development)

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

## Error Handling
- Use try/catch blocks for async operations
- Handle loading and error states appropriately in components

## Database Handling
- Two database options: PostgreSQL (primary) and ClickHouse (analytics)
- PostgreSQL used with NextAuth via @auth/pg-adapter
- ClickHouse used for API usage tracking and credit management
- Always type ClickHouse query results to avoid TypeScript errors
- Example: `const result = rows[0] as { id: string; name: string; }`
- Use conditional database initialization based on environment variables

## Post-Change Process
- After making changes, always run `yarn lint` to verify code quality
- Run `yarn build` to ensure the application builds without type errors
- Test critical flows after making authentication or database changes