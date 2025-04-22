# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `yarn dev` - Start the development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn start` - Start production server (after build)

## Project Structure
- NextJS 15.2.4 with App Router
- React 19.1.0
- TypeScript 5.6.2
- Tailwind CSS 3.4.1
- next-themes for dark/light mode

## Authentication Implementation
- Implementing Passport.js for authentication
- Supporting multiple auth methods:
  - Google OAuth
  - GitHub OAuth
  - Magic Link (email-based passwordless login)

## Code Style Guidelines
- Use 2-space indentation (no tabs)
- Import order: React/Next imports, third-party libs, local modules
- Theme components with appropriate classes (section-themed, card-themed, etc.)
- Use absolute imports with `@/` prefix (paths configured in tsconfig.json)
- Function components with named exports for components
- Keep components focused and modular
- Use TypeScript for type safety, though strict mode is disabled
- Follow naming conventions: camelCase for variables, PascalCase for components

## Error Handling
- Use try/catch blocks for async operations
- Handle loading and error states appropriately in components